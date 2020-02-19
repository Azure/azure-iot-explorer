/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { DeviceIdentity } from '../../../../api/models/deviceIdentity';
import { getDeviceAuthenticationType, generateConnectionString, generateX509ConnectionString } from './deviceIdentityHelper';
import DeviceIdentityCommandBar from './deviceIdentityCommandBar';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { DeviceStatus } from '../../../../api/models/deviceStatus';
import { generateKey } from '../../../../shared/utils/utils';
import { SynchronizationWrapper } from '../../../../api/models/synchronizationWrapper';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import MaskedCopyableTextFieldContainer from '../../../../shared/components/maskedCopyableTextFieldContainer';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { SAS_EXPIRES_MINUTES } from '../../../../constants/devices';
import { HeaderView } from '../../../../shared/components/headerView';
import SasTokenGenerationView from '../../../shared/components/sasTokenGenerationView';
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

export default class DeviceIdentityInformation
    extends React.Component<DeviceIdentityDataProps & DeviceIdentityDispatchProps & RouteComponentProps, DeviceIdentityState> {
    constructor(props: DeviceIdentityDataProps & DeviceIdentityDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            identity: this.props.identityWrapper && this.props.identityWrapper.payload,
            isDirty: false,
            requestMade: false,
            sasTokenConnectionString: '',
            sasTokenExpiration: SAS_EXPIRES_MINUTES,
            sasTokenSelectedKey: ''
        };
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar()}
                        <HeaderView
                            headerText={ResourceKeys.deviceIdentity.headerText}
                        />
                        <div className="device-detail">
                            {this.props.identityWrapper && this.renderInformationSection(context)}
                        </div>
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public static getDerivedStateFromProps(props: DeviceIdentityDataProps & DeviceIdentityDispatchProps & RouteComponentProps, state: DeviceIdentityState): Partial<DeviceIdentityState> | null {
        if (props.identityWrapper) {
            if (state.isDirty && state.requestMade && props.identityWrapper.synchronizationStatus === SynchronizationStatus.upserted) {
                return {
                    identity: props.identityWrapper.payload,
                    isDirty: false,
                    requestMade: false
                };
            }
            else if (!state.isDirty) {
                return {
                    identity: props.identityWrapper.payload
                };
            }
        }
        return null;
    }

    private readonly showCommandBar = () => {
        let onSwapKeys;
        let onGeneratePrimaryKey;
        let onGenerateSecondaryKey;

        if (this.props.identityWrapper &&
            this.props.identityWrapper.payload &&
            this.props.identityWrapper.payload.authentication.type === DeviceAuthenticationType.SymmetricKey) {
                onSwapKeys = this.swapKeys;
                onGeneratePrimaryKey = this.generatePrimaryKey;
                onGenerateSecondaryKey = this.generateSecondaryKey;
        }

        return (
            <DeviceIdentityCommandBar
                disableSave={!this.state.isDirty}
                handleSave={this.handleSave}
                onRegeneratePrimaryKey={onGeneratePrimaryKey}
                onRegenerateSecondaryKey={onGenerateSecondaryKey}
                onSwapKeys={onSwapKeys}
            />
        );
    }

    private readonly handleSave = () => {
        this.props.updateDeviceIdentity(this.state.identity);
        this.setState({
            requestMade: true
        });
    }

    private readonly renderInformationSection = (context: LocalizationContextInterface) => {
        const { identity } = this.state;
        const authType = getDeviceAuthenticationType(identity);
        return (
            <>
                { this.props.identityWrapper.synchronizationStatus === SynchronizationStatus.working ?
                    <MultiLineShimmer/> :
                    <>
                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.deviceID)}
                            label={context.t(ResourceKeys.deviceIdentity.deviceID)}
                            value={this.state.identity && this.state.identity.deviceId}
                            allowMask={false}
                            readOnly={true}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.deviceIDTooltip)}
                        />
                        {this.renderDeviceAuthProperties(context)}
                        <br/>
                        {authType === DeviceAuthenticationType.SymmetricKey && this.renderSasTokenSection()}
                        {this.renderHubRelatedInformation(context)}
                    </>
                }
                {this.props.identityWrapper.synchronizationStatus === SynchronizationStatus.updating && <Overlay/>}
            </>
        );
    }

    private readonly renderSasTokenSection = () => {
        return (
            <SasTokenGenerationView
                activeAzureResourceHostName={this.props.activeAzureResourceHostName}
                deviceIdentity={this.state.identity}
            />
        );
    }

    private readonly renderDeviceAuthProperties = (context: LocalizationContextInterface) => {
        const { activeAzureResourceHostName } = this.props;
        const { identity } = this.state;
        const authType = getDeviceAuthenticationType(identity);
        switch (authType) {
            case DeviceAuthenticationType.SelfSigned:
                return (
                    <>
                        <Label>{context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.text)}</Label>
                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                            value={this.state.identity.authentication.x509Thumbprint.primaryThumbprint}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                        />
                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                            value={this.state.identity.authentication.x509Thumbprint.secondaryThumbprint}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
                        />
                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionString)}
                            value={generateX509ConnectionString(activeAzureResourceHostName, identity.deviceId)}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.connectionStringTooltip)}
                        />
                    </>
                );
            case DeviceAuthenticationType.CACertificate:
                return (
                    <>
                        <Label>{context.t(ResourceKeys.deviceIdentity.authenticationType.ca.text)}</Label>
                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionString)}
                            value={generateX509ConnectionString(activeAzureResourceHostName, identity.deviceId)}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.ca.connectionStringTooltip)}
                        />
                    </>
                );
            case DeviceAuthenticationType.SymmetricKey:
                return (
                    <>
                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            value={this.state.identity.authentication.symmetricKey.primaryKey}
                            allowMask={true}
                            readOnly={false}
                            onTextChange={this.changePrimaryKey}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                        />

                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            value={this.state.identity.authentication.symmetricKey.secondaryKey}
                            allowMask={true}
                            readOnly={false}
                            onTextChange={this.changeSecondaryKey}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                        />

                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            value={generateConnectionString(activeAzureResourceHostName, identity.deviceId, identity.authentication.symmetricKey.primaryKey)}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionStringTooltip)}
                        />

                        <MaskedCopyableTextFieldContainer
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            value={generateConnectionString(activeAzureResourceHostName, identity.deviceId, identity.authentication.symmetricKey.secondaryKey)}
                            allowMask={true}
                            readOnly={true}
                            labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionStringTooltip)}
                        />
                    </>
                );
            default:
                return (<></>);
        }
    }

    private readonly renderHubRelatedInformation = (context: LocalizationContextInterface) => {
        return (
            <Toggle
                checked={this.state.identity && this.state.identity.status === DeviceStatus.Enabled}
                ariaLabel={context.t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                label={context.t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                onText={context.t(ResourceKeys.deviceIdentity.hubConnectivity.enable)}
                offText={context.t(ResourceKeys.deviceIdentity.hubConnectivity.disable)}
                onChange={this.changeToggle}
            />
        );
    }

    private readonly changePrimaryKey = (value: string) => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(this.state.identity));
        identityDeepCopy.authentication.symmetricKey.primaryKey = value;
        this.setState({
            identity: identityDeepCopy,
            isDirty: true
        });
    }

    private readonly changeSecondaryKey = (value: string) => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(this.state.identity));
        identityDeepCopy.authentication.symmetricKey.secondaryKey = value;
        this.setState({
            identity: identityDeepCopy,
            isDirty: true
        });
    }

    private readonly generatePrimaryKey = () => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(this.state.identity));
        identityDeepCopy.authentication.symmetricKey.primaryKey = generateKey();
        this.setState({
            identity: identityDeepCopy,
            isDirty: true
        });
    }

    private readonly generateSecondaryKey = () => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(this.state.identity));
        identityDeepCopy.authentication.symmetricKey.secondaryKey = generateKey();
        this.setState({
            identity: identityDeepCopy,
            isDirty: true
        });
    }

    private readonly swapKeys = () => {
        const identityDeepCopy: DeviceIdentity = JSON.parse(JSON.stringify(this.state.identity));
        const originalPrimaryKey  = identityDeepCopy.authentication.symmetricKey.primaryKey;
        const originalSecondaryKey  = identityDeepCopy.authentication.symmetricKey.secondaryKey;

        identityDeepCopy.authentication.symmetricKey.primaryKey = originalSecondaryKey;
        identityDeepCopy.authentication.symmetricKey.secondaryKey = originalPrimaryKey;

        this.setState({
            identity: identityDeepCopy,
            isDirty: true
        });
    }

    private readonly changeToggle = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        const identity = {
            ...this.state.identity,
            status: checked ? DeviceStatus.Enabled.toString() : DeviceStatus.Disabled.toString()};
        this.setState({
            identity,
            isDirty: true
        });
    }
}
