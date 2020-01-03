/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../../localization/resourceKeys';
import { DeviceAuthenticationType } from '../../../../../api/models/deviceAuthenticationType';
import { DeviceIdentity } from '../../../../../api/models/deviceIdentity';
import { DeviceStatus } from '../../../../../api/models/deviceStatus';
import { validateKey, validateThumbprint, validateDeviceId } from '../../../../../shared/utils/utils';
import LabelWithTooltip from '../../../../../shared/components/labelWithTooltip';
import BreadcrumbContainer from '../../../../../shared/components/breadcrumbContainer';
import MaskedCopyableTextFieldContainer from '../../../../../shared/components/maskedCopyableTextFieldContainer';
import { SynchronizationStatus } from '../../../../../api/models/synchronizationStatus';
import { ROUTE_PARTS } from '../../../../../constants/routes';
import '../../../../../css/_addDevice.scss';
import '../../../../../css/_layouts.scss';
import { SAVE, CANCEL } from '../../../../../constants/iconNames';

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
                        <div className="view-command">
                            {this.showCommandBar(context)}
                        </div>
                        <div className="edit-content view-scroll">
                            <div className="form">
                                {this.showDeviceId(context)}
                                {this.showAuthentication(context)}
                                {this.showConnectivity(context)}
                            </div>
                        </div>
                        {this.props.deviceListSyncStatus === SynchronizationStatus.updating && <Overlay/>}
                    </form>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidUpdate() {
        if (this.props.deviceListSyncStatus === SynchronizationStatus.upserted) { // only when device has been added successfully would navigate to list view
            this.navigateToDeviceList();
        }
    }

    private readonly navigateToDeviceList = () => {
        const path = this.props.match.url.replace(/\/add/, ``);
        this.props.history.push(path);
    }

    private readonly showDeviceId = (context: LocalizationContextInterface) => {
        return (
            <MaskedCopyableTextFieldContainer
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
                setFocus={true}
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
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={this.state.primaryKey}
                    required={true}
                    onTextChange={this.changePrimaryKey}
                    allowMask={true}
                    t={context.t}
                    readOnly={false}
                    error={!!this.state.primaryKeyError ? context.t(this.state.primaryKeyError) : ''}
                    labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                />
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={this.state.secondaryKey}
                    required={true}
                    onTextChange={this.changeSecondaryKey}
                    allowMask={true}
                    t={context.t}
                    readOnly={false}
                    error={!!this.state.secondaryKeyError ? context.t(this.state.secondaryKeyError) : ''}
                    labelCallout={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                />
            </>
        );
    }

    private readonly renderSelfSignedSection = (context: LocalizationContextInterface) => {
        return (
            <>
                <MaskedCopyableTextFieldContainer
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
                <MaskedCopyableTextFieldContainer
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

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        return (
            <CommandBar
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.deviceLists.commands.save),
                        disabled: this.disableSaveButton(),
                        iconProps: {
                            iconName: SAVE
                        },
                        key: SAVE,
                        name: context.t(ResourceKeys.deviceLists.commands.save),
                        type: 'submit'
                    },
                    {
                        ariaLabel: context.t(ResourceKeys.deviceLists.commands.close),
                        disabled: false,
                        iconProps: {
                            iconName: CANCEL
                        },
                        key: CANCEL,
                        name: context.t(ResourceKeys.deviceLists.commands.close),
                        onClick: this.navigateToDeviceList
                    },
                ]}
            />
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
        // Prevent page refresh
        event.preventDefault();
        this.props.handleSave(this.getDeviceIdentity());
    }
}
