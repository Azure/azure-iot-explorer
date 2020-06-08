/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning';
import { useLocalizationContext } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { MaskedCopyableTextField } from '../../../shared/components/maskedCopyableTextField';
import { CollapsibleSection } from '../../../shared/components/collapsibleSection';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { SAS_EXPIRES_MINUTES } from '../../../constants/devices';
import { generateSASTokenConnectionStringForModuleIdentity, generateSASTokenConnectionStringForDevice } from '../../deviceContent/deviceIdentity/components/deviceIdentityHelper';
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

export const SasTokenGenerationView: React.FC<SasTokenGenerationDataProps> = (props: SasTokenGenerationDataProps) => {
    const { t } = useLocalizationContext();
    const {activeAzureResourceHostName, moduleIdentity, deviceIdentity } = props;

    const [ sasTokenConnectionString, setSasTokenConnectionString ] = React.useState('');
    const [ sasTokenExpiration, setSasTokenExpiration ] = React.useState(SAS_EXPIRES_MINUTES);
    const [ sasTokenSelectedKey, setSasTokenSelectedKey ] = React.useState('');

    const renderKeyDropdown = () => {

        const authentication = moduleIdentity ? moduleIdentity.authentication : deviceIdentity.authentication;
        const options: IDropdownOption[] = [
            {
                key: authentication.symmetricKey.primaryKey,
                text: t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)
            },
            {
                key: authentication.symmetricKey.secondaryKey,
                text: t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)
            }
        ];

        return (
            <Dropdown
                className={'sas-token-key-field'}
                label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.symmetricKey)}
                selectedKey={sasTokenSelectedKey || undefined}
                options={options}
                onChange={onSelectedKeyChanged}
                required={true}
            />
        );
    };

    const onSelectedKeyChanged = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSasTokenSelectedKey(item.key as string);
    };

    const onExpirationChanged = (event: React.FocusEvent<HTMLInputElement>) => {
        const numValue = + event.target.value;
        const newSasTokenExpiration = !!numValue && numValue >= 0 && numValue <= Number.MAX_SAFE_INTEGER ? numValue : 0;
        setSasTokenExpiration(newSasTokenExpiration);
    };

    const onExpirationIncrement = (value: string) => {
        const numValue = (+value);

        const newSasTokenExpiration = numValue < Number.MAX_SAFE_INTEGER ? numValue + 1 : Number.MAX_SAFE_INTEGER;
        setSasTokenExpiration(newSasTokenExpiration);
    };

    const onExpirationDecrement = (value: string) => {
        const numValue = (+value);

        const newSasTokenExpiration = numValue > 0 ? numValue - 1 : 0;
        setSasTokenExpiration(newSasTokenExpiration);
    };

    const onGenerateSASClicked = () => {
        const newSasTokenConnectionString = moduleIdentity ? generateSASTokenConnectionStringForModuleIdentity(
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

        setSasTokenConnectionString(newSasTokenConnectionString);
    };

    if (!moduleIdentity && !deviceIdentity) {
        return (<></>);
    }

    const position = Position && Position.top || 0;

    return (
        <CollapsibleSection
            expanded={false}
            label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.label)}
            tooltipText={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.toolTip)}
        >
            <div className="sas-token-section">
                {renderKeyDropdown()}
                <SpinButton
                    className={'sas-token-expiration-field'}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.expiration)}
                    labelPosition={position}
                    min={0}
                    max={Number.MAX_SAFE_INTEGER}
                    onBlur={onExpirationChanged}
                    onIncrement={onExpirationIncrement}
                    onDecrement={onExpirationDecrement}
                    value={`${sasTokenExpiration}`}
                />
                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.textField.ariaLabel)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.textField.label)}
                    value={sasTokenConnectionString}
                    allowMask={true}
                    readOnly={true}
                />
                <PrimaryButton
                    className={'sas-token-generate-button'}
                    title={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.generateButton.title)}
                    text={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.generateButton.text)}
                    onClick={onGenerateSASClicked}
                    disabled={sasTokenSelectedKey === ''}
                />
            </div>
        </CollapsibleSection>
    );
};
