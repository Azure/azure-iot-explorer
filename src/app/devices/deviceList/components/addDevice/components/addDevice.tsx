/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { PrimaryButton, DefaultButton, Overlay } from 'office-ui-fabric-react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../../localization/resourceKeys';
import { DeviceAuthenticationType } from '../../../../../api/models/deviceAuthenticationType';
import { DeviceIdentity } from '../../../../../api/models/deviceIdentity';
import { DeviceStatus } from '../../../../../api/models/deviceStatus';
import { validateKey, validateThumbprint, validateDeviceId } from '../../../../../shared/utils/utils';
import LabelWithTooltip from '../../../../../shared/components/labelWithTooltip';
import BreadcrumbContainer from '../../../../../shared/components/breadcrumbContainer';
import { MaskedCopyableTextField } from '../../../../../shared/components/maskedCopyableTextField';
import { SynchronizationStatus } from '../../../../../api/models/synchronizationStatus';
import '../../../../../css/_addDevice.scss';
import '../../../../../css/_layouts.scss';

export interface AddDeviceActionProps {
    handleSave: (deviceIdentity: DeviceIdentity) => void;
}

export interface AddDeviceDataProps {
    deviceListSyncStatus: SynchronizationStatus;
}

export interface AddDeviceState {
    authenticationType: DeviceAuthenticationType;
    autoGenerateKeys: boolean;
    primaryKey: string;
    secondaryKey: string;
    primaryThumbprint: string;
    secondaryThumbprint: string;
    deviceId: string;
    status: DeviceStatus;

    deviceIdError?: string;
    primaryKeyError?: string;
    secondaryKeyError?: string;
    primaryThumbprintError?: string;
    secondaryThumbprintError?: string;
}

export default class AddDevice extends React.Component<AddDeviceActionProps & AddDeviceDataProps & RouteComponentProps, AddDeviceState> {

    private readonly deviceIdFieldRef = React.createRef<MaskedCopyableTextField>();

    constructor(props: AddDeviceActionProps & AddDeviceDataProps & RouteComponentProps) {
        super(props);

        this.state = {
            authenticationType: DeviceAuthenticationType.SymmetricKey,
            autoGenerateKeys: true,
            deviceId: '',
            primaryKey: '',
            primaryThumbprint: '',
            secondaryKey: '',
            secondaryThumbprint: '',
            status: DeviceStatus.Enabled
        };
    }

    public render() {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                     <form onSubmit={this.handleSave} className="view add-device">
                        <div className="view-header">
                            <Route component={BreadcrumbContainer} />
                        </div>

                        <div className="edit-content view-scroll">
                            <div className="form">
                                {this.showDeviceId(context)}
                                {this.showAuthentication(context)}
                                {this.showConnectivity(context)}
                                {this.showCommands(context)}
                            </div>
                        </div>
                        {this.props.deviceListSyncStatus === SynchronizationStatus.updating && <Overlay/>}
                    </form>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentWillReceiveProps(newProps: AddDeviceActionProps & AddDeviceDataProps & RouteComponentProps) {
        if (newProps.deviceListSyncStatus === SynchronizationStatus.upserted) { // only when device has been added successfully would navigate to list view
            this.props.history.push(`/devices`);
        }
    }

    public componentDidMount() {
        const node = this.deviceIdFieldRef.current;
        if (!!node) {
            node.focus();
        }
    }

    private readonly showDeviceId = (context: LocalizationContextInterface) => {
        return (
            <MaskedCopyableTextField
                ref={this.deviceIdFieldRef}
                ariaLabel={context.t(ResourceKeys.deviceIdentity.deviceID)}
                label={context.t(ResourceKeys.deviceIdentity.deviceID)}
                value={this.state.deviceId}
                required={true}
                onTextChange={this.changeDeviceId}
                allowMask={false}
                t={context.t}
                readOnly={false}
                error={!!this.state.deviceIdError ? context.t(this.state.deviceIdError) : ''}
                labelCallout={context.t(ResourceKeys.deviceIdentity.deviceIDTooltip)}
            />
        );
    }

    private readonly getAuthType = (context: LocalizationContextInterface) => {
        return (
            <ChoiceGroup
                label={context.t(ResourceKeys.deviceIdentity.authenticationType.text)}
                selectedKey={this.state.authenticationType}
                onChange={this.changeAuthenticationType}
                options={
                    [
                        {
                            key: DeviceAuthenticationType.SymmetricKey,
                            text: context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.type)
                        },
                        {
                            key: DeviceAuthenticationType.SelfSigned,
                            text: context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.type)
                        },
                        {
                            key: DeviceAuthenticationType.CACertificate,
                            text: context.t(ResourceKeys.deviceIdentity.authenticationType.ca.type)
                        }
                    ]
                }
                required={true}
            />
        );
    }

    private readonly renderSymmetricKeySection = (context: LocalizationContextInterface) => {
        return (
            <>
                <MaskedCopyableTextField
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={this.state.primaryKey}
                    required={true}
                    onTextChange={this.changePrimaryKey}
                    allowMask={true}
                    t={context.t}
                    readOnly={false}
                    error={!!this.state.primaryKeyError ? context.t(this.state.primaryKeyError) : ''}
                    labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionStringTooltip)}
                />
                <MaskedCopyableTextField
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={this.state.secondaryKey}
                    required={true}
                    onTextChange={this.changeSecondaryKey}
                    allowMask={true}
                    t={context.t}
                    readOnly={false}
                    error={!!this.state.secondaryKeyError ? context.t(this.state.secondaryKeyError) : ''}
                    labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionStringTooltip)}
                />
            </>
        );
    }

    private readonly renderSelfSignedSection = (context: LocalizationContextInterface) => {
        return (
            <>
                <MaskedCopyableTextField
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    label={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    value={this.state.primaryThumbprint}
                    required={true}
                    onTextChange={this.changePrimaryThumbprint}
                    allowMask={true}
                    t={context.t}
                    readOnly={false}
                    error={!!this.state.primaryThumbprintError ? context.t(this.state.primaryThumbprintError) : ''}
                    labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                />
                <MaskedCopyableTextField
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    label={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    value={this.state.secondaryThumbprint}
                    required={true}
                    onTextChange={this.changeSecondaryThumbprint}
                    allowMask={true}
                    t={context.t}
                    readOnly={false}
                    error={!!this.state.secondaryThumbprintError ? context.t(this.state.secondaryThumbprintError) : ''}
                    labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
                />
            </>
        );
    }

    private readonly showAuthentication = (context: LocalizationContextInterface) => {
        return (
            <div className="authentication">
                {this.getAuthType(context)}
                {this.state.authenticationType === DeviceAuthenticationType.SymmetricKey &&
                    <>
                        <Checkbox
                            className="autoGenerateButton"
                            label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.autoGenerate)}
                            checked={this.state.autoGenerateKeys}
                            onChange={this.changeAutoGenerateKeys}
                        />
                        {!this.state.autoGenerateKeys &&
                            this.renderSymmetricKeySection(context)
                        }
                    </>
                }
                {this.state.authenticationType === DeviceAuthenticationType.SelfSigned &&
                   this.renderSelfSignedSection(context)
                }
            </div>
        );
    }

    private readonly showConnectivity = (context: LocalizationContextInterface) => {

        return (
            <div className="connectivity">
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.deviceIdentity.hubConnectivity.tooltip)}
                >
                    {context.t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                </LabelWithTooltip>
                <Toggle
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.hubConnectivity.label)}
                    checked={this.state.status === DeviceStatus.Enabled}
                    onText={context.t(ResourceKeys.deviceIdentity.hubConnectivity.enable)}
                    offText={context.t(ResourceKeys.deviceIdentity.hubConnectivity.disable)}
                    onChange={this.changeDeviceStatus}
                />
            </div>
        );
    }

    private readonly showCommands = (context: LocalizationContextInterface) => {
        return (
            <div className="button-groups">
                <PrimaryButton
                    className="submit-button"
                    disabled={this.disableSaveButton()}
                    text={context.t(ResourceKeys.deviceLists.commands.save)}
                    ariaDescription={context.t(ResourceKeys.deviceLists.commands.save)}
                    type={'submit'}
                />
                <DefaultButton
                    className="submit-button"
                    onClick={this.handleCancel}
                    text={context.t(ResourceKeys.deviceLists.commands.close)}
                    ariaDescription={context.t(ResourceKeys.deviceLists.commands.close)}
                />
            </div>
        );
    }

    private readonly changeDeviceId = (newValue?: string) => {
        const deviceIdError = this.getDeviceIdValidationMessage(newValue);
        this.setState({
            deviceId: newValue,
            deviceIdError
        });
    }

    private readonly changeAuthenticationType = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => {
        this.setState({
            authenticationType: option.key as DeviceAuthenticationType
        });
    }

    private readonly changeDeviceStatus = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        this.setState(
            {
                status: checked ? DeviceStatus.Enabled : DeviceStatus.Disabled
            }
        );
    }

    private readonly changeAutoGenerateKeys = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        this.setState(
            {
                autoGenerateKeys: checked
            }
        );
        if (checked) {
            this.setState(
                {
                    primaryKey: undefined,
                    secondaryKey: undefined
                }
            );
        }
    }

    private readonly changePrimaryKey = (newValue?: string) => {
        const primaryKeyError = this.getSymmetricKeyValidationMessage(newValue);
        this.setState({
            primaryKey: newValue,
            primaryKeyError
        });
    }

    private readonly changeSecondaryKey = (newValue?: string) => {
        const secondaryKeyError = this.getSymmetricKeyValidationMessage(newValue);
        this.setState({
            secondaryKey: newValue,
            secondaryKeyError
        });
    }

    private readonly changePrimaryThumbprint = (newValue?: string) => {
        const primaryThumbprintError = this.getThumbprintValidationMessage(newValue);
        this.setState({
            primaryThumbprint: newValue,
            primaryThumbprintError
        });
    }

    private readonly changeSecondaryThumbprint = (newValue?: string) => {
        const secondaryThumbprintError = this.getThumbprintValidationMessage(newValue);
        this.setState({
            secondaryThumbprint: newValue,
            secondaryThumbprintError
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly disableSaveButton = () => {
        if (!this.state.deviceId || !validateDeviceId(this.state.deviceId)) { return true; }
        if (this.state.authenticationType === DeviceAuthenticationType.SymmetricKey) {
            if (!this.state.autoGenerateKeys) {
                return ! (this.state.primaryKey &&
                this.state.secondaryKey &&
                validateKey(this.state.primaryKey) &&
                validateKey(this.state.secondaryKey));
            }
        }
        if (this.state.authenticationType === DeviceAuthenticationType.SelfSigned) {
            return ! (this.state.primaryThumbprint &&
            this.state.secondaryThumbprint &&
            validateThumbprint(this.state.primaryThumbprint) &&
            validateThumbprint(this.state.secondaryThumbprint));
        }
        return false;
    }

    private readonly getDeviceIdentity = (): DeviceIdentity => {
        return {
            authentication: {
                symmetricKey: this.state.authenticationType === DeviceAuthenticationType.SymmetricKey ? {
                    primaryKey: this.state.autoGenerateKeys ? null : this.state.primaryKey,
                    secondaryKey: this.state.autoGenerateKeys ? null : this.state.secondaryKey
                } : null,
                type: this.state.authenticationType.toString(),
                x509Thumbprint: this.state.authenticationType === DeviceAuthenticationType.SelfSigned ? {
                    primaryThumbprint: this.state.primaryThumbprint,
                    secondaryThumbprint: this.state.secondaryThumbprint
                } : null,
            },
            capabilities: {
                iotEdge: false
            },
            cloudToDeviceMessageCount: null,
            deviceId: this.state.deviceId,
            etag: null,
            lastActivityTime: null,
            status: this.state.status.toString(),
            statusReason: null,
            statusUpdatedTime: null
        };
    }

    private getDeviceIdValidationMessage = (value: string) => {
        return validateDeviceId(value) ? '' : ResourceKeys.deviceIdentity.validation.invalidDeviceId;
    }

    private getSymmetricKeyValidationMessage = (value: string): string => {
        return this.state.autoGenerateKeys ? '' : validateKey(value) ? '' : ResourceKeys.deviceIdentity.validation.invalidKey;
    }

    private getThumbprintValidationMessage = (value: string) => {
        return validateThumbprint(value) ? '' : ResourceKeys.deviceIdentity.validation.invalidThumbprint;
    }

    private readonly handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent page regresh
        event.preventDefault();
        this.props.handleSave(this.getDeviceIdentity());
    }

    private readonly handleCancel = () => {
        this.props.history.push(`/devices`);
    }
}
