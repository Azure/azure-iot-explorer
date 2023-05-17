/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { CommandBar, ChoiceGroup, IChoiceGroupOption, Checkbox, TextField } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CANCEL, SAVE } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ROUTE_PARAMS } from '../../../../constants/routes';
import { HeaderView } from '../../../../shared/components/headerView';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { validateThumbprint, validateKey, validateModuleIdentityName, processThumbprint } from '../../../../shared/utils/utils';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { addModuleIdentityReducer } from '../reducer';
import { addModuleIdentitySaga } from '../saga';
import { addModuleStateInitial } from '../state';
import { addModuleIdentityAction } from '../actions';
import { AppInsightsClient } from '../../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_USER_ACTIONS } from '../../../../constants/telemetry';
import '../../../../css/_deviceDetail.scss';

const initialKeyValue = {
    error: '',
    thumbprint: '',
    thumbprintError: '',
    value: ''
};

export const AddModuleIdentity: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const deviceId = getDeviceIdFromQueryString(search);

    const [ localState, dispatch ] = useAsyncSagaReducer(addModuleIdentityReducer, addModuleIdentitySaga, addModuleStateInitial(), 'addModuleState');
    const { synchronizationStatus } = localState;
    const [ authenticationType, setAuthenticationType ] = React.useState(DeviceAuthenticationType.SymmetricKey);
    const [ autoGenerateKeys, setautoGenerateKeys ] = React.useState<boolean>(true);
    const [ module, setModule ] = React.useState<{ id: string, error: string }>({ id: '', error: ''});
    const [ primaryKey, setPrimaryKey ] = React.useState(initialKeyValue);
    const [ secondaryKey, setSecondaryKey ] = React.useState(initialKeyValue);

    React.useEffect(() => {
        if (synchronizationStatus === SynchronizationStatus.upserted) { // only when module identity has been added successfully would navigate to module list view
            navigateToModuleList();
        }
    },              [synchronizationStatus]);

    const showCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.command.save),
                        disabled: disableSaveButton(),
                        iconProps: {iconName: SAVE},
                        key: SAVE,
                        name: t(ResourceKeys.moduleIdentity.command.save),
                        onClick: handleSave
                    },
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.command.cancel),
                        iconProps: {iconName: CANCEL},
                        key: CANCEL,
                        name: t(ResourceKeys.moduleIdentity.command.cancel),
                        onClick: navigateToModuleList
                    }
                ]}
            />
        );
    };

    const showModuleId = () => {
        return (
            <TextField
                ariaLabel={t(ResourceKeys.moduleIdentity.moduleId)}
                label={t(ResourceKeys.moduleIdentity.moduleId)}
                value={module.id}
                required={true}
                onChange={changeModuleIdentityName}
                errorMessage={!!module.error ? t(module.error) : ''}
                description={t(ResourceKeys.moduleIdentity.moduleIdTooltip)}
            />
        );
    };

    const getAuthType = () => {
        return (
            <ChoiceGroup
                label={t(ResourceKeys.moduleIdentity.authenticationType.text)}
                selectedKey={authenticationType}
                onChange={changeAuthenticationType}
                options={
                    [
                        {
                            key: DeviceAuthenticationType.SymmetricKey,
                            text: t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.type)
                        },
                        {
                            key: DeviceAuthenticationType.SelfSigned,
                            text: t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.type)
                        },
                        {
                            key: DeviceAuthenticationType.CACertificate,
                            text: t(ResourceKeys.moduleIdentity.authenticationType.ca.type)
                        }
                    ]
                }
                required={true}
            />
        );
    };

    const renderSymmetricKeySection = () => {
        return (
            <>
                <TextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={primaryKey.value}
                    required={true}
                    onChange={changePrimaryKey}
                    type={'password'}
                    canRevealPassword={true}
                    errorMessage={!!primaryKey.error ? t(primaryKey.error) : ''}
                    description={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                />
                <TextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={secondaryKey.value}
                    required={true}
                    onChange={changeSecondaryKey}
                    type={'password'}
                    canRevealPassword={true}
                    errorMessage={!!secondaryKey.error ? t(secondaryKey.error) : ''}
                    description={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                />
            </>
        );
    };

    const renderSelfSignedSection = () => {
        return (
            <>
                <TextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    value={primaryKey.thumbprint}
                    required={true}
                    onChange={changePrimaryThumbprint}
                    type={'password'}
                    canRevealPassword={true}
                    errorMessage={!!primaryKey.thumbprintError ? t(primaryKey.thumbprintError) : ''}
                    description={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                />
                <TextField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    value={secondaryKey.thumbprint}
                    required={true}
                    onChange={changeSecondaryThumbprint}
                    type={'password'}
                    canRevealPassword={true}
                    readOnly={false}
                    errorMessage={!!secondaryKey.thumbprintError ? t(secondaryKey.thumbprintError) : ''}
                    description={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
                />
            </>
        );
    };

    const showAuthentication = () => {
        return (
            <div className="authentication">
                {getAuthType()}
                {authenticationType === DeviceAuthenticationType.SymmetricKey &&
                    <>
                        <Checkbox
                            className="autoGenerateButton"
                            label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.autoGenerate)}
                            checked={autoGenerateKeys}
                            onChange={changeAutoGenerateKeys}
                        />
                        {!autoGenerateKeys &&
                            renderSymmetricKeySection()
                        }
                    </>
                }
                {authenticationType === DeviceAuthenticationType.SelfSigned &&
                   renderSelfSignedSection()
                }
            </div>
        );
    };

    const handleSave = () => {
        AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.ADD_MODULE);
        dispatch(addModuleIdentityAction.started({
            authentication: {
                symmetricKey: authenticationType === DeviceAuthenticationType.SymmetricKey ? {
                    primaryKey: autoGenerateKeys ? null : primaryKey.value,
                    secondaryKey: autoGenerateKeys ? null : secondaryKey.value
                } : null,
                type: authenticationType.toString(),
                x509Thumbprint: authenticationType === DeviceAuthenticationType.SelfSigned ? {
                    primaryThumbprint: processThumbprint(primaryKey.thumbprint),
                    secondaryThumbprint: processThumbprint(secondaryKey.thumbprint)
                } : null,
            },
            deviceId,
            moduleId: module.id
        }));
    };

    const navigateToModuleList = () => {
        const path = pathname.replace(/\/add\/.*/, ``);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    const disableSaveButton = () => {
        if (!module.id || !validateModuleIdentityName(module.id)) { return true; }
        if (authenticationType === DeviceAuthenticationType.SymmetricKey) {
            return !isSymmetricKeyValid();
        }
        if (authenticationType === DeviceAuthenticationType.SelfSigned) {
            return !isSelfSignedThumbprintValid();
        }
        return false;
    };

    const isSymmetricKeyValid = () => {
        if (!autoGenerateKeys) {
            return primaryKey.value &&
                secondaryKey.value &&
                validateKey(primaryKey.value) &&
                validateKey(secondaryKey.value);
        }
        return true;
    };

    const isSelfSignedThumbprintValid = () => {
        return primaryKey.thumbprint &&
            secondaryKey.thumbprint &&
            validateThumbprint(primaryKey.thumbprint) &&
            validateThumbprint(secondaryKey.thumbprint);
    };

    const changeModuleIdentityName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const moduleIdError = getModuleIdentityNameValidationMessage(newValue);
        setModule({
            error: moduleIdError,
            id: newValue
        });
    };

    const changeAuthenticationType = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => {
        setAuthenticationType(option.key as DeviceAuthenticationType);
    };

    const changeAutoGenerateKeys = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setautoGenerateKeys(checked);
        if (checked) {
            setPrimaryKey(initialKeyValue);
            setSecondaryKey(initialKeyValue);
        }
    };

    const changePrimaryKey = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const primaryKeyError = getSymmetricKeyValidationMessage(newValue);
        setPrimaryKey({
            ...primaryKey,
            error: primaryKeyError,
            value: newValue
        });
    };

    const changeSecondaryKey = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const secondaryKeyError = getSymmetricKeyValidationMessage(newValue);
        setSecondaryKey({
            ...secondaryKey,
            error: secondaryKeyError,
            value: newValue
        });
    };

    const changePrimaryThumbprint = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const primaryThumbprintError = getThumbprintValidationMessage(newValue);
        setPrimaryKey({
            ...primaryKey,
            thumbprint: newValue,
            thumbprintError: primaryThumbprintError
        });
    };

    const changeSecondaryThumbprint = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const secondaryThumbprintError = getThumbprintValidationMessage(newValue);
        setSecondaryKey({
            ...secondaryKey,
            thumbprint: newValue,
            thumbprintError: secondaryThumbprintError
        });
    };

    const getThumbprintValidationMessage = (value: string) => {
        return validateThumbprint(value) ? '' : ResourceKeys.moduleIdentity.validation.invalidThumbprint;
    };

    const getModuleIdentityNameValidationMessage = (value: string) => {
        return validateModuleIdentityName(value) ? '' : ResourceKeys.moduleIdentity.validation.invalidModuleIdentityName;
    };

    const getSymmetricKeyValidationMessage = (value: string): string => {
        return autoGenerateKeys ? '' : validateKey(value) ? '' : ResourceKeys.moduleIdentity.validation.invalidKey;
    };

    return (
        <>
            {showCommandBar()}
            <HeaderView
                headerText={ResourceKeys.moduleIdentity.headerText}
            />
            <div className="device-detail">
                {showModuleId()}
                {showAuthentication()}
            </div>
        </>
    );
};
