/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';
import { Checkbox, Field, Input, InputOnChangeData, Radio, RadioGroup, Switch } from '@fluentui/react-components';
import { PasswordField } from '../../../shared/components/passwordField';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { DeviceStatus } from '../../../api/models/deviceStatus';
import { validateKey, validateThumbprint, validateDeviceId, processThumbprint } from '../../../shared/utils/utils';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { SaveRegular, DismissRegular } from '@fluentui/react-icons';
import { SAVE, CANCEL } from '../../../constants/commandBarItemKeys';
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
    const navigate = useNavigate();

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
        navigate(path);
    };

    const navigateToDeviceIdentity = () => {
        const path = pathname.replace(/\/add/, `/${ROUTE_PARTS.DEVICE_DETAIL}/${ROUTE_PARTS.IDENTITY}/?${ROUTE_PARAMS.DEVICE_ID}=${device.id}`);
        navigate(path);
    };

    const showDeviceId = () => {
        return (
            <Field
                label={t(ResourceKeys.deviceIdentity.deviceID)}
                required={true}
                validationMessage={!!device.error ? t(device.error) : undefined}
                validationState={device.error ? 'error' : undefined}
                hint={t(ResourceKeys.deviceIdentity.deviceIDTooltip)}
            >
                <Input
                    aria-label={t(ResourceKeys.deviceIdentity.deviceID)}
                    value={device.id}
                    onChange={changeDeviceId}
                />
            </Field>
        );
    };

    const getAuthType = () => {
        return (
            <Field
                label={t(ResourceKeys.deviceIdentity.authenticationType.text)}
                required={true}
            >
                <RadioGroup
                    value={authenticationType}
                    onChange={changeAuthenticationType}
                >
                    <Radio
                        value={DeviceAuthenticationType.SymmetricKey}
                        label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.type)}
                    />
                    <Radio
                        value={DeviceAuthenticationType.SelfSigned}
                        label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.type)}
                    />
                    <Radio
                        value={DeviceAuthenticationType.CACertificate}
                        label={t(ResourceKeys.deviceIdentity.authenticationType.ca.type)}
                    />
                </RadioGroup>
            </Field>
        );
    };

    const renderSymmetricKeySection = () => {
        return (
            <>
                <PasswordField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={primaryKey.value}
                    required={true}
                    onChange={changePrimaryKey}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!primaryKey.error ? t(primaryKey.error) : ''}
                    description={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                />
                <PasswordField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={secondaryKey.value}
                    required={true}
                    onChange={changeSecondaryKey}
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
                <PasswordField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    value={primaryKey.thumbprint}
                    required={true}
                    onChange={changePrimaryThumbprint}
                    revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                    errorMessage={!!primaryKey.thumbprintError ? t(primaryKey.thumbprintError) : ''}
                    description={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                />
                <PasswordField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    value={secondaryKey.thumbprint}
                    required={true}
                    onChange={changeSecondaryThumbprint}
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
                <Switch
                    aria-label={t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                    checked={deviceStatus === DeviceStatus.Enabled}
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
                        icon: <SaveRegular />,
                        key: SAVE,
                        name: t(ResourceKeys.deviceLists.commands.save),
                        type: 'submit'
                    },
                    {
                        ariaLabel: t(ResourceKeys.deviceLists.commands.close),
                        disabled: false,
                        icon: <DismissRegular />,
                        key: CANCEL,
                        name: t(ResourceKeys.deviceLists.commands.close),
                        onClick: navigateToDeviceList
                    },
                ]}
            />
        );
    };

    const changeDeviceId = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const deviceIdError = getDeviceIdValidationMessage(data.value);
        setDevice({
            error: deviceIdError,
            id: data.value
        });
    };

    const changeAuthenticationType = (ev: React.FormEvent<HTMLDivElement>, data: { value: string }) => {
        setAuthenticationType(data.value as DeviceAuthenticationType);
    };

    const changeDeviceStatus = (ev: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean }) => setDeviceStatus(data.checked ? DeviceStatus.Enabled : DeviceStatus.Disabled);

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
            {synchronizationStatus === SynchronizationStatus.updating && <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.5)", zIndex: 1 }} />}
        </form>
    );
};
