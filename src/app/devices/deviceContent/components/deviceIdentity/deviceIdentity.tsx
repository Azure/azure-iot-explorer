/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label, Shimmer, Toggle, Overlay } from 'office-ui-fabric-react';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { DeviceIdentity } from '../../../../api/models/deviceIdentity';
import { getDeviceAuthenticationType, generateConnectionString } from './deviceIdentityHelper';
import DeviceIdentityCommandBar from './deviceIdentityCommandBar';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { DeviceStatus } from '../../../../api/models/deviceStatus';
import { generateKey } from '../../../../shared/utils/utils';
import { DeviceIdentityWrapper } from '../../../../api/models/deviceIdentityWrapper';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CopyableMaskField } from '../../../../shared/components/copyableMaskField';
import '../../../../css/_deviceDetail.scss';

export interface DeviceIdentityDispatchProps {
    updateDeviceIdentity: (deviceIdentity: DeviceIdentity) => void;
    getDeviceIdentity: (deviceId: string) => void;
}

export interface DeviceIdentityDataProps {
    identityWrapper: DeviceIdentityWrapper;
    connectionString: string;
}

export interface DeviceIdentityState {
    identity: DeviceIdentity;
    isDirty: boolean;
    requestMade: boolean;
}

export default class DeviceIdentityInformation
    extends React.Component<DeviceIdentityDataProps & DeviceIdentityDispatchProps & RouteComponentProps, DeviceIdentityState> {
    constructor(props: DeviceIdentityDataProps & DeviceIdentityDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            identity: this.props.identityWrapper && this.props.identityWrapper.deviceIdentity,
            isDirty: false,
            requestMade: false
        };
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar()}
                        {this.props.identityWrapper && this.renderInformationSection(context)}

                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.getDeviceIdentity(getDeviceIdFromQueryString(this.props));
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public static getDerivedStateFromProps(props: DeviceIdentityDataProps & DeviceIdentityDispatchProps & RouteComponentProps, state: DeviceIdentityState): Partial<DeviceIdentityState> | null {
        if (props.identityWrapper) {
            if (state.isDirty && state.requestMade && props.identityWrapper.deviceIdentitySynchronizationStatus === SynchronizationStatus.upserted) {
                return {
                    identity: props.identityWrapper.deviceIdentity,
                    isDirty: false,
                    requestMade: false
                };
            }
            else if (!state.isDirty) {
                return {
                    identity: props.identityWrapper.deviceIdentity
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
            this.props.identityWrapper.deviceIdentity &&
            this.props.identityWrapper.deviceIdentity.authentication.type === DeviceAuthenticationType.SymmetricKey) {
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
        return (
            <div className="device-detail">
                { this.props.identityWrapper.deviceIdentitySynchronizationStatus === SynchronizationStatus.working ?
                    <Shimmer/> :
                    <>
                        <CopyableMaskField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.deviceID)}
                            label={context.t(ResourceKeys.deviceIdentity.deviceID)}
                            value={this.state.identity && this.state.identity.deviceId}
                            allowMask={false}
                            t={context.t}
                            readOnly={true}
                        />
                        {this.renderDeviceAuthProperties(context)}
                        <br/>
                        {this.renderHubRelatedInformation(context)}
                    </>
                }
                {this.props.identityWrapper.deviceIdentitySynchronizationStatus === SynchronizationStatus.updating && <Overlay/>}
            </div>
        );
    }

    private readonly renderDeviceAuthProperties = (context: LocalizationContextInterface) => {
        const { connectionString } = this.props;
        const { identity } = this.state;
        const authType = getDeviceAuthenticationType(identity);
        switch (authType) {
            case DeviceAuthenticationType.SelfSigned:
                return (<Label>{context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.text)}</Label>);
            case DeviceAuthenticationType.CACertificate:
                return (<Label>{context.t(ResourceKeys.deviceIdentity.authenticationType.ca.text)}</Label>);
            case DeviceAuthenticationType.SymmetricKey:
                return (
                    <>
                        <CopyableMaskField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            value={this.state.identity.authentication.symmetricKey.primaryKey}
                            allowMask={true}
                            t={context.t}
                            readOnly={false}
                            onTextChange={this.changePrimaryKey}
                        />

                        <CopyableMaskField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            value={this.state.identity.authentication.symmetricKey.secondaryKey}
                            allowMask={true}
                            t={context.t}
                            readOnly={false}
                            onTextChange={this.changeSecondaryKey}
                        />

                        <CopyableMaskField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            value={generateConnectionString(connectionString, identity.deviceId, identity.authentication.symmetricKey.primaryKey)}
                            allowMask={true}
                            t={context.t}
                            readOnly={true}
                        />

                        <CopyableMaskField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            value={generateConnectionString(connectionString, identity.deviceId, identity.authentication.symmetricKey.secondaryKey)}
                            allowMask={true}
                            t={context.t}
                            readOnly={true}
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
