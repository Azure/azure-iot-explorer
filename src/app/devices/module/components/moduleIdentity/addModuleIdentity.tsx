/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CANCEL, SAVE } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../../../api/models/moduleIdentity';
import { ROUTE_PARAMS } from '../../../../constants/routes';
import MaskedCopyableTextFieldContainer from '../../../../shared/components/maskedCopyableTextFieldContainer';
import { HeaderView } from '../../../../shared/components/headerView';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import { validateThumbprint, validateKey, validateModuleIdentityName } from '../../../../shared/utils/utils';
import '../../../../css/_deviceDetail.scss';
import '../../../../css/_moduleIdentity.scss';

export interface AddModuleIdentityDataProps {
    synchronizationStatus: SynchronizationStatus;
}

export interface AddModuleIdentityDispatchProps {
    addModuleIdentity: (moduleIdentity: ModuleIdentity) => void;
}

export interface AddModuleIdentityState {
    authenticationType: DeviceAuthenticationType;
    autoGenerateKeys: boolean;
    primaryKey: string;
    secondaryKey: string;
    primaryThumbprint: string;
    secondaryThumbprint: string;
    moduleId: string;

    moduleIdError?: string;
    primaryKeyError?: string;
    secondaryKeyError?: string;
    primaryThumbprintError?: string;
    secondaryThumbprintError?: string;
}

export default class AddModuleIdentityComponent
    extends React.Component<AddModuleIdentityDataProps & AddModuleIdentityDispatchProps & RouteComponentProps, AddModuleIdentityState> {

    constructor(props: AddModuleIdentityDataProps & AddModuleIdentityDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            authenticationType: DeviceAuthenticationType.SymmetricKey,
            autoGenerateKeys: true,
            moduleId: '',
            primaryKey: '',
            primaryThumbprint: '',
            secondaryKey: '',
            secondaryThumbprint: ''
        };
    }
    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar(context)}
                        <HeaderView
                            headerText={ResourceKeys.moduleIdentity.headerText}
                        />
                        <div className="device-detail">
                            <div className="module-identity">
                                {this.showModuleId(context)}
                                {this.showAuthentication(context)}
                            </div>
                        </div>
                    </>
            )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidUpdate() {
        if (this.props.synchronizationStatus === SynchronizationStatus.upserted) { // only when module identity has been added successfully would navigate to module list view
            this.navigateToModuleList();
        }
    }

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.moduleIdentity.command.save),
                        disabled: this.disableSaveButton(),
                        iconProps: {iconName: SAVE},
                        key: SAVE,
                        name: context.t(ResourceKeys.moduleIdentity.command.save),
                        onClick: this.handleSave
                    },
                    {
                        ariaLabel: context.t(ResourceKeys.moduleIdentity.command.cancel),
                        iconProps: {iconName: CANCEL},
                        key: CANCEL,
                        name: context.t(ResourceKeys.moduleIdentity.command.cancel),
                        onClick: this.navigateToModuleList
                    }
                ]}
            />
        );
    }

    private readonly showModuleId = (context: LocalizationContextInterface) => {
        return (
            <MaskedCopyableTextFieldContainer
                ariaLabel={context.t(ResourceKeys.moduleIdentity.moduleId)}
                label={context.t(ResourceKeys.moduleIdentity.moduleId)}
                value={this.state.moduleId}
                required={true}
                onTextChange={this.changeModuleIdentityName}
                allowMask={false}
                readOnly={false}
                error={!!this.state.moduleIdError ? context.t(this.state.moduleIdError) : ''}
                labelCallout={context.t(ResourceKeys.moduleIdentity.moduleIdTooltip)}
                setFocus={true}
            />
        );
    }

    private readonly getAuthType = (context: LocalizationContextInterface) => {
        return (
            <ChoiceGroup
                label={context.t(ResourceKeys.moduleIdentity.authenticationType.text)}
                selectedKey={this.state.authenticationType}
                onChange={this.changeAuthenticationType}
                options={
                    [
                        {
                            key: DeviceAuthenticationType.SymmetricKey,
                            text: context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.type)
                        },
                        {
                            key: DeviceAuthenticationType.SelfSigned,
                            text: context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.type)
                        },
                        {
                            key: DeviceAuthenticationType.CACertificate,
                            text: context.t(ResourceKeys.moduleIdentity.authenticationType.ca.type)
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
                    ariaLabel={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={this.state.primaryKey}
                    required={true}
                    onTextChange={this.changePrimaryKey}
                    allowMask={true}
                    readOnly={false}
                    error={!!this.state.primaryKeyError ? context.t(this.state.primaryKeyError) : ''}
                    labelCallout={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                />
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={this.state.secondaryKey}
                    required={true}
                    onTextChange={this.changeSecondaryKey}
                    allowMask={true}
                    readOnly={false}
                    error={!!this.state.secondaryKeyError ? context.t(this.state.secondaryKeyError) : ''}
                    labelCallout={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                />
            </>
        );
    }

    private readonly renderSelfSignedSection = (context: LocalizationContextInterface) => {
        return (
            <>
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    label={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    value={this.state.primaryThumbprint}
                    required={true}
                    onTextChange={this.changePrimaryThumbprint}
                    allowMask={true}
                    readOnly={false}
                    error={!!this.state.primaryThumbprintError ? context.t(this.state.primaryThumbprintError) : ''}
                    labelCallout={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                />
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    label={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    value={this.state.secondaryThumbprint}
                    required={true}
                    onTextChange={this.changeSecondaryThumbprint}
                    allowMask={true}
                    readOnly={false}
                    error={!!this.state.secondaryThumbprintError ? context.t(this.state.secondaryThumbprintError) : ''}
                    labelCallout={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
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
                            label={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.autoGenerate)}
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

    private readonly handleSave = () => {
        this.props.addModuleIdentity({
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
            deviceId: getDeviceIdFromQueryString(this.props),
            moduleId: this.state.moduleId
        });
    }

    private readonly navigateToModuleList = () => {
        const path = this.props.match.url.replace(/\/add\/.*/, ``);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }

    private readonly disableSaveButton = () => {
        if (!this.state.moduleId || !validateModuleIdentityName(this.state.moduleId)) { return true; }
        if (this.state.authenticationType === DeviceAuthenticationType.SymmetricKey) {
            return !this.isSymmetricKeyValid();
        }
        if (this.state.authenticationType === DeviceAuthenticationType.SelfSigned) {
            return !this.isSelfSignedThumbprintValid();
        }
        return false;
    }

    private readonly isSymmetricKeyValid = () => {
        if (!this.state.autoGenerateKeys) {
            return this.state.primaryKey &&
                this.state.secondaryKey &&
                validateKey(this.state.primaryKey) &&
                validateKey(this.state.secondaryKey);
        }
        return true;
    }

    private readonly isSelfSignedThumbprintValid = () => {
        return this.state.primaryThumbprint &&
            this.state.secondaryThumbprint &&
            validateThumbprint(this.state.primaryThumbprint) &&
            validateThumbprint(this.state.secondaryThumbprint);
    }

    private readonly changeModuleIdentityName = (newValue?: string) => {
        const moduleIdError = this.getModuleIdentityNameValidationMessage(newValue);
        this.setState({
            moduleId: newValue,
            moduleIdError
        });
    }

    private readonly changeAuthenticationType = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => {
        this.setState({
            authenticationType: option.key as DeviceAuthenticationType
        });
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

    private getThumbprintValidationMessage = (value: string) => {
        return validateThumbprint(value) ? '' : ResourceKeys.moduleIdentity.validation.invalidThumbprint;
    }

    private getModuleIdentityNameValidationMessage = (value: string) => {
        return validateModuleIdentityName(value) ? '' : ResourceKeys.moduleIdentity.validation.invalidModuleIdentityName;
    }

    private getSymmetricKeyValidationMessage = (value: string): string => {
        return this.state.autoGenerateKeys ? '' : validateKey(value) ? '' : ResourceKeys.moduleIdentity.validation.invalidKey;
    }
}
