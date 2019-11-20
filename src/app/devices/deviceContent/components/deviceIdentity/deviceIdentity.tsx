/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { DeviceIdentity } from '../../../../api/models/deviceIdentity';
import { getDeviceAuthenticationType, generateConnectionString, generateX509ConnectionString, generateSASTokenConnectionString } from './deviceIdentityHelper';
import DeviceIdentityCommandBar from './deviceIdentityCommandBar';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { DeviceStatus } from '../../../../api/models/deviceStatus';
import { generateKey } from '../../../../shared/utils/utils';
import { DeviceIdentityWrapper } from '../../../../api/models/deviceIdentityWrapper';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import '../../../../css/_deviceDetail.scss';
import CollapsibleSection from '../../../../shared/components/collapsibleSection';
import { SAS_EXPIRES_MINUTES } from '../../../../constants/devices';

export interface DeviceIdentityDispatchProps {
    updateDeviceIdentity: (deviceIdentity: DeviceIdentity) => void;
}

export interface DeviceIdentityDataProps {
    identityWrapper: DeviceIdentityWrapper;
    connectionString: string;
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
            identity: this.props.identityWrapper && this.props.identityWrapper.deviceIdentity,
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
                        {this.props.identityWrapper && this.renderInformationSection(context)}

                    </>
                )}
            </LocalizationContextConsumer>
        );
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
        const { identity } = this.state;
        const authType = getDeviceAuthenticationType(identity);
        return (
            <div className="device-detail">
                { this.props.identityWrapper.deviceIdentitySynchronizationStatus === SynchronizationStatus.working ?
                    <MultiLineShimmer/> :
                    <>
                        <MaskedCopyableTextField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.deviceID)}
                            label={context.t(ResourceKeys.deviceIdentity.deviceID)}
                            value={this.state.identity && this.state.identity.deviceId}
                            allowMask={false}
                            t={context.t}
                            disabled={true}
                        />
                        {this.renderDeviceAuthProperties(context)}
                        <br/>
                        {authType === DeviceAuthenticationType.SymmetricKey && this.renderSasTokenSection(context)}
                        {this.renderHubRelatedInformation(context)}
                    </>
                }
                {this.props.identityWrapper.deviceIdentitySynchronizationStatus === SynchronizationStatus.updating && <Overlay/>}
            </div>
        );
    }

    private readonly onExpirationChanged = (event: React.FocusEvent<HTMLInputElement>) => {
        const numValue = +event.target.value;
        const sasTokenExpiration = !!numValue && numValue >= 0 && numValue <= Number.MAX_SAFE_INTEGER ? numValue : 0;

        this.setState({
            sasTokenExpiration
        });
    }

    private readonly onExpirationIncrement = (value: string) => {
        const numValue = (+value);

        const sasTokenExpiration = numValue < Number.MAX_SAFE_INTEGER ? numValue + 1 : Number.MAX_SAFE_INTEGER;
        this.setState({
            sasTokenExpiration
        });
    }

    private readonly onExpirationDecrement = (value: string) => {
        const numValue = (+value);

        const sasTokenExpiration = numValue > 0 ? numValue - 1 : 0;
        this.setState({
            sasTokenExpiration
        });
    }

    private readonly onSelectedKeyChanged = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        this.setState({
            sasTokenSelectedKey: item.key as string
        });
    }

    private readonly onGenerateSASClicked = () => {
        const { connectionString } = this.props;
        const { identity, sasTokenExpiration, sasTokenSelectedKey } = this.state;

        const sasTokenConnectionString = generateSASTokenConnectionString(
            connectionString,
            identity.deviceId,
            sasTokenExpiration,
            sasTokenSelectedKey
        );

        this.setState({
            sasTokenConnectionString
        });
    }

    private readonly renderSasTokenSection = (context: LocalizationContextInterface) => {
        const { identity, sasTokenSelectedKey, sasTokenExpiration } = this.state;
        const options: IDropdownOption[] = [
            {
                key: identity.authentication.symmetricKey.primaryKey,
                text: context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)
            },
            {
                key: identity.authentication.symmetricKey.secondaryKey,
                text: context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)
            }
        ];

        const position = Position && Position.top || 0;

        return (
            <CollapsibleSection
                expanded={false}
                label={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.label)}
                tooltipText={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.toolTip)}
            >
                <div className="sas-token-section">
                    <Dropdown
                        className={'sas-token-key-field'}
                        label={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.symmetricKey)}
                        selectedKey={sasTokenSelectedKey || undefined}
                        options={options}
                        onChange={this.onSelectedKeyChanged}
                        required={true}
                    />
                    <SpinButton
                        className={'sas-token-expiration-field'}
                        label={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.expiration)}
                        labelPosition={position}
                        min={0}
                        max={Number.MAX_SAFE_INTEGER}
                        onBlur={this.onExpirationChanged}
                        onIncrement={this.onExpirationIncrement}
                        onDecrement={this.onExpirationDecrement}
                        value={`${sasTokenExpiration}`}
                    />
                    <MaskedCopyableTextField
                        ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.textField.ariaLabel)}
                        label={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.textField.label)}
                        value={this.state.sasTokenConnectionString}
                        allowMask={true}
                        t={context.t}
                        disabled={true}
                    />
                    <PrimaryButton
                        className={'sas-token-generate-button'}
                        title={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.generateButton.title)}
                        text={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.generateButton.text)}
                        onClick={this.onGenerateSASClicked}
                        disabled={sasTokenSelectedKey === ''}
                    />
                </div>
            </CollapsibleSection>
        );
    }

    private readonly renderDeviceAuthProperties = (context: LocalizationContextInterface) => {
        const { connectionString } = this.props;
        const { identity } = this.state;
        const authType = getDeviceAuthenticationType(identity);
        switch (authType) {
            case DeviceAuthenticationType.SelfSigned:
                return (
                    <>
                        <Label>{context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.text)}</Label>
                        <MaskedCopyableTextField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            value={generateX509ConnectionString(connectionString, identity.deviceId)}
                            allowMask={true}
                            t={context.t}
                            disabled={true}
                        />
                    </>
                );
            case DeviceAuthenticationType.CACertificate:
                return (
                    <>
                        <Label>{context.t(ResourceKeys.deviceIdentity.authenticationType.ca.text)}</Label>
                        <MaskedCopyableTextField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            value={generateX509ConnectionString(connectionString, identity.deviceId)}
                            allowMask={true}
                            t={context.t}
                            disabled={true}
                        />
                    </>
                );
            case DeviceAuthenticationType.SymmetricKey:
                return (
                    <>
                        <MaskedCopyableTextField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                            value={this.state.identity.authentication.symmetricKey.primaryKey}
                            allowMask={true}
                            t={context.t}
                            disabled={false}
                            onTextChange={this.changePrimaryKey}
                        />

                        <MaskedCopyableTextField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                            value={this.state.identity.authentication.symmetricKey.secondaryKey}
                            allowMask={true}
                            t={context.t}
                            disabled={false}
                            onTextChange={this.changeSecondaryKey}
                        />

                        <MaskedCopyableTextField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                            value={generateConnectionString(connectionString, identity.deviceId, identity.authentication.symmetricKey.primaryKey)}
                            allowMask={true}
                            t={context.t}
                            disabled={true}
                        />

                        <MaskedCopyableTextField
                            ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                            value={generateConnectionString(connectionString, identity.deviceId, identity.authentication.symmetricKey.secondaryKey)}
                            allowMask={true}
                            t={context.t}
                            disabled={true}
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
