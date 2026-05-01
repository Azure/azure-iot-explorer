/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Field, Option, SpinButton } from '@fluentui/react-components';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { MaskedCopyableTextField } from '../../../shared/components/maskedCopyableTextField';
import { CollapsibleSection } from '../../../shared/components/collapsibleSection';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { SAS_EXPIRES_MINUTES } from '../../../constants/devices';
import { generateSASTokenConnectionStringForModuleIdentity, generateSASTokenConnectionStringForDevice } from '../../deviceIdentity/components/deviceIdentityHelper';
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
    const { t } = useTranslation();
    const {activeAzureResourceHostName, moduleIdentity, deviceIdentity } = props;

    const [ sasTokenConnectionString, setSasTokenConnectionString ] = React.useState('');
    const [ sasTokenExpiration, setSasTokenExpiration ] = React.useState(SAS_EXPIRES_MINUTES);
    const [ sasTokenSelectedKey, setSasTokenSelectedKey ] = React.useState('');

    const renderKeyDropdown = () => {

        const authentication = moduleIdentity ? moduleIdentity.authentication : deviceIdentity.authentication;
        const options = [
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
            <Field
                label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.symmetricKey)}
                required={true}
            >
                <Dropdown
                    className={'sas-token-key-field'}
                    selectedOptions={sasTokenSelectedKey ? [sasTokenSelectedKey] : []}
                    onOptionSelect={onSelectedKeyChanged}
                >
                    {options.map(opt => (
                        <Option key={opt.key} value={opt.key}>{opt.text}</Option>
                    ))}
                </Dropdown>
            </Field>
        );
    };

    const onSelectedKeyChanged = (event: React.SyntheticEvent, data: { optionValue?: string }): void => {
        setSasTokenSelectedKey(data.optionValue);
    };

    const onExpirationChanged = (event: React.SyntheticEvent, data: { value?: number | null; displayValue?: string }) => {
        const numValue = data.value ?? 0;
        const newSasTokenExpiration = numValue >= 0 && numValue <= Number.MAX_SAFE_INTEGER ? numValue : 0;
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

    return (
        <CollapsibleSection
            expanded={false}
            label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.label)}
            tooltipText={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.toolTip)}
        >
            <div className="sas-token-section">
                {renderKeyDropdown()}
                <Field
                    label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.expiration)}
                >
                    <SpinButton
                        className={'sas-token-expiration-field'}
                        min={0}
                        max={Number.MAX_SAFE_INTEGER}
                        onChange={onExpirationChanged}
                        value={sasTokenExpiration}
                    />
                </Field>
                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.textField.ariaLabel)}
                    label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.textField.label)}
                    value={sasTokenConnectionString}
                    allowMask={true}
                />
                <Button
                    appearance="primary"
                    className={'sas-token-generate-button'}
                    title={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.generateButton.title)}
                    onClick={onGenerateSASClicked}
                    disabled={sasTokenSelectedKey === ''}
                >
                    {t(ResourceKeys.deviceIdentity.authenticationType.sasToken.generateButton.text)}
                </Button>
            </div>
        </CollapsibleSection>
    );
};
