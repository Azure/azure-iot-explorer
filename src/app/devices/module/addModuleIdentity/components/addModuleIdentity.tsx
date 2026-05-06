/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';
import { Checkbox, Field, Input, InputOnChangeData, Radio, RadioGroup } from '@fluentui/react-components';
import { PasswordField } from '../../../../shared/components/passwordField';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { SaveRegular, DismissRegular } from '@fluentui/react-icons';
import { CANCEL, SAVE } from '../../../../constants/commandBarItemKeys';
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
import { LiveRegion } from '../../../../shared/components/liveRegion';
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
    const navigate = useNavigate();
    const deviceId = getDeviceIdFromQueryString(search);

    const [ localState, dispatch ] = useAsyncSagaReducer(addModuleIdentityReducer, addModuleIdentitySaga, addModuleStateInitial(), 'addModuleState');
    const { synchronizationStatus } = localState;
    const [ authenticationType, setAuthenticationType ] = React.useState(DeviceAuthenticationType.SymmetricKey);
    const [ autoGenerateKeys, setautoGenerateKeys ] = React.useState<boolean>(true);
    const [ module, setModule ] = React.useState<{ id: string, error: string }>({ id: '', error: ''});
    const [ primaryKey, setPrimaryKey ] = React.useState(initialKeyValue);
    const [ secondaryKey, setSecondaryKey ] = React.useState(initialKeyValue);
    const [ announcement, setAnnouncement ] = React.useState('');

    React.useEffect(() => {
        if (synchronizationStatus === SynchronizationStatus.upserted) { // only when module identity has been added successfully would navigate to module list view
            navigateToModuleList();
        }
    },              [synchronizationStatus]); // eslint-disable-line react-hooks/exhaustive-deps -- only react to status change

    const showCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.command.save),
                        disabled: disableSaveButton(),
                        icon: <SaveRegular />,
                        key: SAVE,
                        name: t(ResourceKeys.moduleIdentity.command.save),
                        onClick: handleSave
                    },
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.command.cancel),
                        icon: <DismissRegular />,
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
            <Field
                label={t(ResourceKeys.moduleIdentity.moduleId)}
                required={true}
                validationMessage={!!module.error ? t(module.error) : undefined}
                validationState={module.error ? 'error' : undefined}
                hint={t(ResourceKeys.moduleIdentity.moduleIdTooltip)}
            >
                <Input
                    aria-label={t(ResourceKeys.moduleIdentity.moduleId)}
                    value={module.id}
                    onChange={changeModuleIdentityName}
                />
            </Field>
        );
    };

    const getAuthType = () => {
        return (
            <Field
                label={t(ResourceKeys.moduleIdentity.authenticationType.text)}
                required={true}
            >
                <RadioGroup
                    value={authenticationType}
                    onChange={changeAuthenticationType}
                >
                    <Radio
                        value={DeviceAuthenticationType.SymmetricKey}
                        label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.type)}
                    />
                    <Radio
                        value={DeviceAuthenticationType.SelfSigned}
                        label={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.type)}
                    />
                    <Radio
                        value={DeviceAuthenticationType.CACertificate}
                        label={t(ResourceKeys.moduleIdentity.authenticationType.ca.type)}
                    />
                </RadioGroup>
            </Field>
        );
    };

    const renderSymmetricKeySection = () => {
        return (
            <>
                <PasswordField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={primaryKey.value}
                    required={true}
                    onChange={changePrimaryKey}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!primaryKey.error ? t(primaryKey.error) : ''}
                    description={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                />
                <PasswordField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={secondaryKey.value}
                    required={true}
                    onChange={changeSecondaryKey}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!secondaryKey.error ? t(secondaryKey.error) : ''}
                    description={t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                />
            </>
        );
    };

    const renderSelfSignedSection = () => {
        return (
            <>
                <PasswordField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    value={primaryKey.thumbprint}
                    required={true}
                    onChange={changePrimaryThumbprint}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!primaryKey.thumbprintError ? t(primaryKey.thumbprintError) : ''}
                    description={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                />
                <PasswordField
                    ariaLabel={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    label={t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    value={secondaryKey.thumbprint}
                    required={true}
                    onChange={changeSecondaryThumbprint}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
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
        setAnnouncement(t(ResourceKeys.moduleIdentity.command.save));
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
        navigate(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
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

    const changeModuleIdentityName = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const moduleIdError = getModuleIdentityNameValidationMessage(data.value);
        setModule({
            error: moduleIdError,
            id: data.value
        });
    };

    const changeAuthenticationType = (ev: React.FormEvent<HTMLDivElement>, data: { value: string }) => {
        setAuthenticationType(data.value as DeviceAuthenticationType);
    };

    const changeAutoGenerateKeys = (ev: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean | 'mixed' }) => {
        setautoGenerateKeys(!!data.checked);
        if (data.checked) {
            setPrimaryKey(initialKeyValue);
            setSecondaryKey(initialKeyValue);
        }
    };

    const changePrimaryKey = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const primaryKeyError = getSymmetricKeyValidationMessage(data.value);
        setPrimaryKey({
            ...primaryKey,
            error: primaryKeyError,
            value: data.value
        });
    };

    const changeSecondaryKey = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const secondaryKeyError = getSymmetricKeyValidationMessage(data.value);
        setSecondaryKey({
            ...secondaryKey,
            error: secondaryKeyError,
            value: data.value
        });
    };

    const changePrimaryThumbprint = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const primaryThumbprintError = getThumbprintValidationMessage(data.value);
        setPrimaryKey({
            ...primaryKey,
            thumbprint: data.value,
            thumbprintError: primaryThumbprintError
        });
    };

    const changeSecondaryThumbprint = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const secondaryThumbprintError = getThumbprintValidationMessage(data.value);
        setSecondaryKey({
            ...secondaryKey,
            thumbprint: data.value,
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
            <LiveRegion message={announcement} />
        </>
    );
};
