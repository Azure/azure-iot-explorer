/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { Overlay, Toggle, ChoiceGroup, IChoiceGroupOption, Checkbox, CommandBar, TextField } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { DeviceStatus } from '../../../api/models/deviceStatus';
import { validateKey, validateThumbprint, validateDeviceId, processThumbprint } from '../../../shared/utils/utils';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { SAVE, CANCEL } from '../../../constants/iconNames';
import { addDeviceSaga } from '../saga';
import { addDeviceReducer } from '../reducer';
import { addDeviceStateInitial } from '../state';
import { addDeviceAction } from '../actions';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { AppInsightsClient } from '../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_USER_ACTIONS } from '../../../constants/telemetry';
import '../../../css/_addDevice.scss';

const initialKeyValue = {
    error: '',
    thumbprint: '',
    thumbprintError: '',
    value: ''
};

export const AddDevice: React.FC = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const history = useHistory();

    const [ localState, dispatch ] = useAsyncSagaReducer(addDeviceReducer, addDeviceSaga, addDeviceStateInitial(), 'addDeviceState');
    const { synchronizationStatus } = localState;
    const [ authenticationType, setAuthenticationType ] = React.useState(DeviceAuthenticationType.SymmetricKey);
    const [ autoGenerateKeys, setautoGenerateKeys ] = React.useState<boolean>(true);
    const [ device, setDevice ] = React.useState<{id: string, error: string}>({ id: '', error: '' });
    const [ deviceStatus, setDeviceStatus ] = React.useState<DeviceStatus>(DeviceStatus.Enabled);
    const [ primaryKey, setPrimaryKey ] = React.useState(initialKeyValue);
    const [ secondaryKey, setSecondaryKey ] = React.useState(initialKeyValue);

    React.useEffect(() => {
        if (synchronizationStatus === SynchronizationStatus.upserted) { // only when device has been added successfully would navigate to list view
            navigateToDeviceIdentity();
        }
    },              [synchronizationStatus]);

    const navigateToDeviceList = () => {
        const path = pathname.replace(/\/add/, `/`);
        history.push(path);
    };

    const navigateToDeviceIdentity = () => {
        const path = pathname.replace(/\/add/, `/${ROUTE_PARTS.DEVICE_DETAIL}/${ROUTE_PARTS.IDENTITY}/?${ROUTE_PARAMS.DEVICE_ID}=${device.id}`);
        history.push(path);
    };

    const showDeviceId = () => {
        return (
            <TextField
                ariaLabel={t(ResourceKeys.deviceIdentity.deviceID)}
                label={t(ResourceKeys.deviceIdentity.deviceID)}
                value={device.id}
                required={true}
                onChange={changeDeviceId}
                errorMessage={!!device.error ? t(device.error) : ''}
                description={t(ResourceKeys.deviceIdentity.deviceIDTooltip)}
            />
        );
    };

    const getAuthType = () => {
        return (
            <ChoiceGroup
                label={t(ResourceKeys.deviceIdentity.authenticationType.text)}
                selectedKey={authenticationType}
                onChange={changeAuthenticationType}
                options={
                    [
                        {
                            key: DeviceAuthenticationType.SymmetricKey,
                            text: t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.type)
                        },
                        {
                            key: DeviceAuthenticationType.SelfSigned,
                            text: t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.type)
                        },
                        {
                            key: DeviceAuthenticationType.CACertificate,
                            text: t(ResourceKeys.deviceIdentity.authenticationType.ca.type)
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
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={primaryKey.value}
                    required={true}
                    onChange={changePrimaryKey}
                    type={'password'}
                    canRevealPassword={true}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!primaryKey.error ? t(primaryKey.error) : ''}
                    description={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                />
                <TextField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={secondaryKey.value}
                    required={true}
                    onChange={changeSecondaryKey}
                    type={'password'}
                    canRevealPassword={true}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!secondaryKey.error ? t(secondaryKey.error) : ''}
                    description={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                />
            </>
        );
    };

    const renderSelfSignedSection = () => {
        return (
            <>
                <TextField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    value={primaryKey.thumbprint}
                    required={true}
                    onChange={changePrimaryThumbprint}
                    type={'password'}
                    canRevealPassword={true}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!primaryKey.thumbprintError ? t(primaryKey.thumbprintError) : ''}
                    description={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                />
                <TextField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    value={secondaryKey.thumbprint}
                    required={true}
                    onChange={changeSecondaryThumbprint}
                    type={'password'}
                    canRevealPassword={true}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!secondaryKey.thumbprintError ? t(secondaryKey.thumbprintError) : ''}
                    description={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
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
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.autoGenerate)}
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

    const showConnectivity = () => {

        return (
            <div className="connectivity">
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.deviceIdentity.hubConnectivity.tooltip)}
                >
                    {t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                </LabelWithTooltip>
                <Toggle
                    ariaLabel={t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                    checked={deviceStatus === DeviceStatus.Enabled}
                    onText={t(ResourceKeys.deviceIdentity.hubConnectivity.enable)}
                    offText={t(ResourceKeys.deviceIdentity.hubConnectivity.disable)}
                    onChange={changeDeviceStatus}
                />
            </div>
        );
    };

    const showCommandBar = () => {
        return (
            <CommandBar
                items={[
                    {
                        ariaLabel: t(ResourceKeys.deviceLists.commands.save),
                        disabled: disableSaveButton(),
                        iconProps: {
                            iconName: SAVE
                        },
                        key: SAVE,
                        name: t(ResourceKeys.deviceLists.commands.save),
                        type: 'submit'
                    },
                    {
                        ariaLabel: t(ResourceKeys.deviceLists.commands.close),
                        disabled: false,
                        iconProps: {
                            iconName: CANCEL
                        },
                        key: CANCEL,
                        name: t(ResourceKeys.deviceLists.commands.close),
                        onClick: navigateToDeviceList
                    },
                ]}
            />
        );
    };

    const changeDeviceId = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const deviceIdError = getDeviceIdValidationMessage(newValue);
        setDevice({
            error: deviceIdError,
            id: newValue
        });
    };

    const changeAuthenticationType = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => {
        setAuthenticationType(option.key as DeviceAuthenticationType);
    };

    const changeDeviceStatus = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => setDeviceStatus(checked ? DeviceStatus.Enabled : DeviceStatus.Disabled);

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

    // tslint:disable-next-line:cyclomatic-complexity
    const disableSaveButton = () => {
        if (!device.id || !validateDeviceId(device.id)) { return true; }
        if (authenticationType === DeviceAuthenticationType.SymmetricKey) {
            if (!autoGenerateKeys) {
                return ! (primaryKey.value &&
                secondaryKey.value &&
                validateKey(primaryKey.value) &&
                validateKey(secondaryKey.value));
            }
        }
        if (authenticationType === DeviceAuthenticationType.SelfSigned) {
            return ! (primaryKey.thumbprint &&
            secondaryKey.thumbprint &&
            validateThumbprint(primaryKey.thumbprint) &&
            validateThumbprint(secondaryKey.thumbprint));
        }
        return false;
    };

    const getDeviceIdentity = (): DeviceIdentity => {
        return {
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
            capabilities: {
                iotEdge: false
            },
            cloudToDeviceMessageCount: null,
            deviceId: device.id,
            etag: null,
            lastActivityTime: null,
            status: status.toString(),
            statusReason: null,
            statusUpdatedTime: null
        };
    };

    const getDeviceIdValidationMessage = (value: string) => validateDeviceId(value) ? '' : ResourceKeys.deviceIdentity.validation.invalidDeviceId;

    const getSymmetricKeyValidationMessage = (value: string): string => autoGenerateKeys ? '' : validateKey(value) ? '' : ResourceKeys.deviceIdentity.validation.invalidKey;

    const getThumbprintValidationMessage = (value: string) => validateThumbprint(value) ? '' : ResourceKeys.deviceIdentity.validation.invalidThumbprint;

    const onSaveHandler = (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent page refresh
        event.preventDefault();
        const deviceIdentity = getDeviceIdentity();
        AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.ADD_DEVICE);
        dispatch(addDeviceAction.started(deviceIdentity));
    };

    return (
        <form onSubmit={onSaveHandler} className="add-device">
            {showCommandBar()}
            <div>
                <div className="form">
                    {showDeviceId()}
                    {showAuthentication()}
                    {showConnectivity()}
                </div>
            </div>
            {synchronizationStatus === SynchronizationStatus.updating && <Overlay/>}
        </form>
    );
};
