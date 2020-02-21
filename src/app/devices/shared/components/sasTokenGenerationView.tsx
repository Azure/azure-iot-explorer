/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import MaskedCopyableTextFieldContainer from '../../../shared/components/maskedCopyableTextFieldContainer';
import CollapsibleSection from '../../../shared/components/collapsibleSection';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { SAS_EXPIRES_MINUTES } from '../../../constants/devices';
import { generateSASTokenConnectionStringForModuleIdentity, generateSASTokenConnectionStringForDevice } from '../../deviceContent/components/deviceIdentity/deviceIdentityHelper';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import '../../../css/_sasToken.scss';

export interface SasTokenGenerationDataProps {
    activeAzureResourceHostName: string;
    deviceIdentity?: DeviceIdentity;
    moduleIdentity?: ModuleIdentity;
}

export interface SasTokenGenerationState {
    sasTokenExpiration: number;
    sasTokenConnectionString: string;
    sasTokenSelectedKey: string;
}

export default class SasTokenGenerationView extends React.Component<SasTokenGenerationDataProps, SasTokenGenerationState> {

    constructor(props: SasTokenGenerationDataProps) {
        super(props);

        this.state = {
            sasTokenConnectionString: '',
            sasTokenExpiration: SAS_EXPIRES_MINUTES,
            sasTokenSelectedKey: '',
        };
    }

    public render(): JSX.Element {

        const { moduleIdentity, deviceIdentity } = this.props;

        if (!moduleIdentity && !deviceIdentity) {
            return (<></>);
        }

        const { sasTokenSelectedKey, sasTokenExpiration } = this.state;
        const position = Position && Position.top || 0;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <CollapsibleSection
                        expanded={false}
                        label={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.label)}
                        tooltipText={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.toolTip)}
                    >
                        <div className="sas-token-section">
                            {this.renderKeyDropdown(context)}
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
                            <MaskedCopyableTextFieldContainer
                                ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.textField.ariaLabel)}
                                label={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.textField.label)}
                                value={this.state.sasTokenConnectionString}
                                allowMask={true}
                                readOnly={true}
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
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly renderKeyDropdown = (context: LocalizationContextInterface) => {
        const { moduleIdentity, deviceIdentity } = this.props;
        const authentication = moduleIdentity ? moduleIdentity.authentication : deviceIdentity.authentication;
        const options: IDropdownOption[] = [
            {
                key: authentication.symmetricKey.primaryKey,
                text: context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)
            },
            {
                key: authentication.symmetricKey.secondaryKey,
                text: context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)
            }
        ];

        return (
            <Dropdown
                className={'sas-token-key-field'}
                label={context.t(ResourceKeys.deviceIdentity.authenticationType.sasToken.symmetricKey)}
                selectedKey={this.state.sasTokenSelectedKey || undefined}
                options={options}
                onChange={this.onSelectedKeyChanged}
                required={true}
            />
        );
    }

    private readonly onSelectedKeyChanged = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        this.setState({
            sasTokenSelectedKey: item.key as string
        });
    }

    private readonly onExpirationChanged = (event: React.FocusEvent<HTMLInputElement>) => {
        const numValue = + event.target.value;
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

    private readonly onGenerateSASClicked = () => {
        const { activeAzureResourceHostName, moduleIdentity, deviceIdentity } = this.props;
        const { sasTokenExpiration, sasTokenSelectedKey } = this.state;

        const sasTokenConnectionString = moduleIdentity ? generateSASTokenConnectionStringForModuleIdentity(
            activeAzureResourceHostName,
            moduleIdentity.deviceId,
            moduleIdentity.moduleId,
            sasTokenExpiration,
            sasTokenSelectedKey
        ) : generateSASTokenConnectionStringForDevice(
            activeAzureResourceHostName,
            deviceIdentity.deviceId,
            sasTokenExpiration,
            sasTokenSelectedKey
        );

        this.setState({
            sasTokenConnectionString
        });
    }
}
