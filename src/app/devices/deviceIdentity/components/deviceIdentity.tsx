/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label, Toggle, TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { getDeviceAuthenticationType, generateConnectionString, generateX509ConnectionString } from './deviceIdentityHelper';
import { DeviceIdentityCommandBar } from './deviceIdentityCommandBar';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import { DeviceStatus } from '../../../api/models/deviceStatus';
import { generateKey } from '../../../shared/utils/utils';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { HeaderView } from '../../../shared/components/headerView';
import { SasTokenGenerationView } from '../../shared/components/sasTokenGenerationView';
import { useIotHubContext } from '../../../iotHub/hooks/useIotHubContext';
import { AppInsightsClient } from '../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../../../app/constants/telemetry';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import '../../../css/_deviceDetail.scss';

export interface DeviceIdentityDispatchProps {
    updateDeviceIdentity: (deviceIdentity: DeviceIdentity) => void;
}

export interface DeviceIdentityDataProps {
    deviceIdentity: DeviceIdentity;
    synchronizationStatus: SynchronizationStatus;
}

export const DeviceIdentityInformation: React.FC<DeviceIdentityDataProps & DeviceIdentityDispatchProps> = (props: DeviceIdentityDataProps & DeviceIdentityDispatchProps) => {
    const { t } = useTranslation();
    const { hostName } = useIotHubContext();

    const { deviceIdentity, synchronizationStatus } = props;
    const [state, setState] = React.useState({
        identity: props.deviceIdentity,
        isDirty: false,
    });

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.DEVICE_IDENTITY});
    }, []); // tslint:disable-line: align

    React.useEffect(() => {
        if (synchronizationStatus === SynchronizationStatus.fetched) {
            const identity: DeviceIdentity = JSON.parse(JSON.stringify(deviceIdentity));
            setState({
                identity,
                isDirty: false
            });
        }
    }, [synchronizationStatus, deviceIdentity]); // tslint:disable-line: align

    const showCommandBar = () => {
        let onSwapKeys;
        let onGeneratePrimaryKey;
        let onGenerateSecondaryKey;

        if (props.deviceIdentity &&
            props.deviceIdentity.authentication.type === DeviceAuthenticationType.SymmetricKey) {
            onSwapKeys = swapKeys;
            onGeneratePrimaryKey = generatePrimaryKey;
            onGenerateSecondaryKey = generateSecondaryKey;
        }

        return (
            <DeviceIdentityCommandBar
                disableSave={!state.isDirty}
                handleSave={handleSave}
                onRegeneratePrimaryKey={onGeneratePrimaryKey}
                onRegenerateSecondaryKey={onGenerateSecondaryKey}
                onSwapKeys={onSwapKeys}
            />
        );
    };

    const handleSave = () => {
        props.updateDeviceIdentity(state.identity);
    };

    const renderInformationSection = () => {
        const { identity } = state;
        const authType = getDeviceAuthenticationType(identity);
        return (
            <>
                {props.synchronizationStatus === SynchronizationStatus.working || props.synchronizationStatus === SynchronizationStatus.updating ?
                    <MultiLineShimmer /> :
                    <>
                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.deviceID)}
                            label={t(ResourceKeys.deviceIdentity.deviceID)}
                            value={state.identity && state.identity.deviceId}
                            readOnly={true}
                            description={t(ResourceKeys.deviceIdentity.deviceIDTooltip)}
                        />
                        {renderDeviceAuthProperties()}
                        <br />
                        {authType === DeviceAuthenticationType.SymmetricKey && renderSasTokenSection()}
                        {renderHubRelatedInformation()}
                    </>
                }
            </>
        );
    };

    const renderSasTokenSection = () => {
        return (
            <SasTokenGenerationView
                activeAzureResourceHostName={hostName}
                deviceIdentity={state.identity}
            />
        );
    };

    const renderDeviceAuthProperties = () => {
        const { identity } = state;
        const authType = getDeviceAuthenticationType(identity);
        switch (authType) {
            case DeviceAuthenticationType.SelfSigned:
                return (
                    <>
                        <Label>{t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.text)}</Label>
                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                            value={state.identity.authentication.x509Thumbprint.primaryThumbprint}
                            type={'password'}
                            canRevealPassword={true}
                            revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                            readOnly={true}
                            description={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                        />
                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                            value={state.identity.authentication.x509Thumbprint.secondaryThumbprint}
                            type={'password'}
                            canRevealPassword={true}
                            revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                            readOnly={true}
                            description={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
                        />
                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionString)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionString)}
                            value={generateX509ConnectionString(hostName, identity.deviceId)}
                            type={'password'}
                            canRevealPassword={true}
                            revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                            readOnly={true}
                            description={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionStringTooltip)}
                        />
                    </>
                );
            case DeviceAuthenticationType.CACertificate:
                return (
                    <>
                        <Label>{t(ResourceKeys.deviceIdentity.authenticationType.ca.text)}</Label>
                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionString)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionString)}
                            value={generateX509ConnectionString(hostName, identity.deviceId)}
                            type={'password'}
                            canRevealPassword={true}
                            revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                            readOnly={true}
                            description={t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionStringTooltip)}
                        />
                    </>
                );
            case DeviceAuthenticationType.SymmetricKey:
                return (
                    <>
                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            value={state.identity.authentication.symmetricKey.primaryKey}
                            type={'password'}
                            canRevealPassword={true}
                            revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                            onChange={changePrimaryKey}
                            description={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                        />

                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            value={state.identity.authentication.symmetricKey.secondaryKey}
                            type={'password'}
                            canRevealPassword={true}
                            revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                            onChange={changeSecondaryKey}
                            description={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                        />

                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            value={generateConnectionString(hostName, identity.deviceId, identity.authentication.symmetricKey.primaryKey)}
                            type={'password'}
                            canRevealPassword={true}
                            revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                            readOnly={true}
                            description={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionStringTooltip)}
                        />

                        <TextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            value={generateConnectionString(hostName, identity.deviceId, identity.authentication.symmetricKey.secondaryKey)}
                            type={'password'}
                            canRevealPassword={true}
                            revealPasswordAriaLabel={t(ResourceKeys.common.revealPassword)}
                            readOnly={true}
                            description={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionStringTooltip)}
                        />
                    </>
                );
            default:
                return (<></>);
        }
    };

    const renderHubRelatedInformation = () => {
        return (
            <Toggle
                checked={state.identity && state.identity.status === DeviceStatus.Enabled}
                ariaLabel={t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                label={t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                onText={t(ResourceKeys.deviceIdentity.hubConnectivity.enable)}
                offText={t(ResourceKeys.deviceIdentity.hubConnectivity.disable)}
                onChange={changeToggle}
            />
        );
    };

    const changePrimaryKey = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value: string) => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(state.identity));
        identityDeepCopy.authentication.symmetricKey.primaryKey = value;
        setState({
            ...state,
            identity: identityDeepCopy,
            isDirty: true
        });
    };

    const changeSecondaryKey = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value: string) => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(state.identity));
        identityDeepCopy.authentication.symmetricKey.secondaryKey = value;
        setState({
            ...state,
            identity: identityDeepCopy,
            isDirty: true
        });
    };

    const generatePrimaryKey = () => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(state.identity));
        identityDeepCopy.authentication.symmetricKey.primaryKey = generateKey();
        setState({
            ...state,
            identity: identityDeepCopy,
            isDirty: true
        });
        raiseNotificationToast({
            text: {
                translationKey: ResourceKeys.deviceIdentity.commands.regeneratePrimary.generated
            },
            type: NotificationType.info
        });
    };

    const generateSecondaryKey = () => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(state.identity));
        identityDeepCopy.authentication.symmetricKey.secondaryKey = generateKey();
        setState({
            ...state,
            identity: identityDeepCopy,
            isDirty: true
        });
        raiseNotificationToast({
            text: {
                translationKey: ResourceKeys.deviceIdentity.commands.regenerateSecondary.generated
            },
            type: NotificationType.info
        });
    };

    const swapKeys = () => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(state.identity));
        const originalPrimaryKey = identityDeepCopy.authentication.symmetricKey.primaryKey;
        const originalSecondaryKey = identityDeepCopy.authentication.symmetricKey.secondaryKey;

        identityDeepCopy.authentication.symmetricKey.primaryKey = originalSecondaryKey;
        identityDeepCopy.authentication.symmetricKey.secondaryKey = originalPrimaryKey;

        setState({
            ...state,
            identity: identityDeepCopy,
            isDirty: true
        });
        raiseNotificationToast({
            text: {
                translationKey: ResourceKeys.deviceIdentity.commands.swapKeys.swapped
            },
            type: NotificationType.info
        });
    };

    const changeToggle = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        const identity = {
            ...state.identity,
            status: checked ? DeviceStatus.Enabled.toString() : DeviceStatus.Disabled.toString()
        };
        setState({
            ...state,
            identity,
            isDirty: true
        });
    };

    return (
        <>
            {showCommandBar()}
            <HeaderView
                headerText={ResourceKeys.deviceIdentity.headerText}
            />
            <div className="device-detail">
                {renderInformationSection()}
            </div>
        </>
    );
};
