/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { DeviceIdentity } from '../../../../api/models/deviceIdentity';
import { getDeviceAuthenticationType, generateConnectionString, generateX509ConnectionString } from './deviceIdentityHelper';
import { DeviceIdentityCommandBar } from './deviceIdentityCommandBar';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { DeviceStatus } from '../../../../api/models/deviceStatus';
import { generateKey } from '../../../../shared/utils/utils';
import { SynchronizationWrapper } from '../../../../api/models/synchronizationWrapper';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { HeaderView } from '../../../../shared/components/headerView';
import { SasTokenGenerationView } from '../../../shared/components/sasTokenGenerationView';
import '../../../../css/_deviceDetail.scss';

export interface DeviceIdentityDispatchProps {
    updateDeviceIdentity: (deviceIdentity: DeviceIdentity) => void;
}

export interface DeviceIdentityDataProps {
    activeAzureResourceHostName: string;
    identityWrapper: SynchronizationWrapper<DeviceIdentity>;
}

export interface DeviceIdentityState {
    identity: DeviceIdentity;
    isDirty: boolean;
    requestMade: boolean;
    sasTokenExpiration: number;
    sasTokenConnectionString: string;
    sasTokenSelectedKey: string;
}

export const DeviceIdentityInformation: React.FC<DeviceIdentityDataProps & DeviceIdentityDispatchProps> = (props: DeviceIdentityDataProps & DeviceIdentityDispatchProps) => {
    const { t } = useLocalizationContext();
    const { identityWrapper, updateDeviceIdentity, activeAzureResourceHostName } = props;

    const [ state, setState ] = React.useState({
        identity: identityWrapper && identityWrapper.payload,
        isDirty: false,
        requestMade: false
    });

    // tslint:disable-next-line: cyclomatic-complexity
    React.useEffect(() => {
        if (identityWrapper) {
            if (state.isDirty && state.requestMade && props.identityWrapper.synchronizationStatus === SynchronizationStatus.upserted) {
                setState({
                    identity: props.identityWrapper.payload,
                    isDirty: false,
                    requestMade: false
                });
            }
            else if (!state.isDirty) {
                setState({
                    ...state,
                    identity: props.identityWrapper.payload
                });
            }
        }
    },              [identityWrapper]);

    const showCommandBar = () => {
        let onSwapKeys;
        let onGeneratePrimaryKey;
        let onGenerateSecondaryKey;

        if (identityWrapper &&
            identityWrapper.payload &&
            identityWrapper.payload.authentication.type === DeviceAuthenticationType.SymmetricKey) {
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
        setState({
            ...state,
            requestMade: true
        });
    };

    const renderInformationSection = () => {
        const { identity } = state;
        const authType = getDeviceAuthenticationType(identity);
        return (
            <>
                { identityWrapper.synchronizationStatus === SynchronizationStatus.working ?
                    <MultiLineShimmer/> :
                    <>
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.deviceID)}
                            label={t(ResourceKeys.deviceIdentity.deviceID)}
                            value={state.identity && state.identity.deviceId}
                            allowMask={false}
                            readOnly={true}
                            labelCallout={t(ResourceKeys.deviceIdentity.deviceIDTooltip)}
                        />
                        {renderDeviceAuthProperties()}
                        <br/>
                        {authType === DeviceAuthenticationType.SymmetricKey && renderSasTokenSection()}
                        {renderHubRelatedInformation()}
                    </>
                }
                {identityWrapper.synchronizationStatus === SynchronizationStatus.updating && <Overlay/>}
            </>
        );
    };

    const renderSasTokenSection = () => {
        return (
            <SasTokenGenerationView
                activeAzureResourceHostName={props.activeAzureResourceHostName}
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
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                            value={state.identity.authentication.x509Thumbprint.primaryThumbprint}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                        />
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                            value={state.identity.authentication.x509Thumbprint.secondaryThumbprint}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
                        />
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionString)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionString)}
                            value={generateX509ConnectionString(activeAzureResourceHostName, identity.deviceId)}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionStringTooltip)}
                        />
                    </>
                );
            case DeviceAuthenticationType.CACertificate:
                return (
                    <>
                        <Label>{t(ResourceKeys.deviceIdentity.authenticationType.ca.text)}</Label>
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionString)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionString)}
                            value={generateX509ConnectionString(activeAzureResourceHostName, identity.deviceId)}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionStringTooltip)}
                        />
                    </>
                );
            case DeviceAuthenticationType.SymmetricKey:
                return (
                    <>
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            value={state.identity.authentication.symmetricKey.primaryKey}
                            allowMask={true}
                            readOnly={false}
                            onTextChange={changePrimaryKey}
                            labelCallout={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                        />

                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            value={state.identity.authentication.symmetricKey.secondaryKey}
                            allowMask={true}
                            readOnly={false}
                            onTextChange={changeSecondaryKey}
                            labelCallout={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                        />

                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            value={generateConnectionString(activeAzureResourceHostName, identity.deviceId, identity.authentication.symmetricKey.primaryKey)}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionStringTooltip)}
                        />

                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            label={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            value={generateConnectionString(activeAzureResourceHostName, identity.deviceId, identity.authentication.symmetricKey.secondaryKey)}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionStringTooltip)}
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

    const changePrimaryKey = (value: string) => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(state.identity));
        identityDeepCopy.authentication.symmetricKey.primaryKey = value;
        setState({
            ...state,
            identity: identityDeepCopy,
            isDirty: true
        });
    };

    const changeSecondaryKey = (value: string) => {
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
    };

    const generateSecondaryKey = () => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(state.identity));
        identityDeepCopy.authentication.symmetricKey.secondaryKey = generateKey();
        setState({
            ...state,
            identity: identityDeepCopy,
            isDirty: true
        });
    };

    const swapKeys = () => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(state.identity));
        const originalPrimaryKey  = identityDeepCopy.authentication.symmetricKey.primaryKey;
        const originalSecondaryKey  = identityDeepCopy.authentication.symmetricKey.secondaryKey;

        identityDeepCopy.authentication.symmetricKey.primaryKey = originalSecondaryKey;
        identityDeepCopy.authentication.symmetricKey.secondaryKey = originalPrimaryKey;

        setState({
            ...state,
            identity: identityDeepCopy,
            isDirty: true
        });
    };

    const changeToggle = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        const identity = {
            ...state.identity,
            status: checked ? DeviceStatus.Enabled.toString() : DeviceStatus.Disabled.toString()};
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
                {identityWrapper && renderInformationSection()}
            </div>
        </>
    );
};
