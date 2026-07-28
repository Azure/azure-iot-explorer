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

type SasTokenKey = 'primary' | 'secondary';

export interface SasTokenGenerationDataProps {
    activeAzureResourceHostName: string;
    deviceIdentity?: DeviceIdentity;
    moduleIdentity?: ModuleIdentity;
}

export interface SasTokenGenerationState {
    sasTokenExpiration: number;
    sasTokenConnectionString: string;
    sasTokenSelectedKey: SasTokenKey | '';
}

export const SasTokenGenerationView: React.FC<SasTokenGenerationDataProps> = (props: SasTokenGenerationDataProps) => {
    const { t } = useTranslation();
    const {activeAzureResourceHostName, moduleIdentity, deviceIdentity } = props;

    const [ sasTokenConnectionString, setSasTokenConnectionString ] = React.useState('');
    const [ sasTokenExpiration, setSasTokenExpiration ] = React.useState(SAS_EXPIRES_MINUTES);
    const [ sasTokenSelectedKey, setSasTokenSelectedKey ] = React.useState<SasTokenKey | ''>('');

    const renderKeyDropdown = () => {
        const options = [
            {
                key: 'primary' as SasTokenKey,
                text: t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryKey)
            },
            {
                key: 'secondary' as SasTokenKey,
                text: t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryKey)
            }
        ];
        const selectedOption = options.find(option => option.key === sasTokenSelectedKey);

        return (
            <Field
                label={t(ResourceKeys.deviceIdentity.authenticationType.sasToken.symmetricKey)}
                required={true}
            >
                <Dropdown
                    className={'sas-token-key-field'}
                    selectedOptions={sasTokenSelectedKey ? [sasTokenSelectedKey] : []}
                    value={selectedOption?.text ?? ''}
                    onOptionSelect={onSelectedKeyChanged}
                >
                    {options.map(opt => (
                        <Option key={opt.key} value={opt.key} text={opt.text}>{opt.text}</Option>
                    ))}
                </Dropdown>
            </Field>
        );
    };

    const onSelectedKeyChanged = (event: React.SyntheticEvent, data: { optionValue?: string }): void => {
        if (data.optionValue === 'primary' || data.optionValue === 'secondary') {
            setSasTokenSelectedKey(data.optionValue);
        }
    };

    const onExpirationChanged = (event: React.SyntheticEvent, data: { value?: number | null; displayValue?: string }) => {
        const numValue = data.value === undefined && data.displayValue !== undefined ?
            Number(data.displayValue) :
            data.value;

        if (numValue !== null && numValue !== undefined && Number.isSafeInteger(numValue) && numValue >= 1) {
            setSasTokenExpiration(numValue);
        }
    };

    const onGenerateSASClicked = () => {
        const authentication = moduleIdentity ? moduleIdentity.authentication : deviceIdentity.authentication;
        const selectedKey = sasTokenSelectedKey === 'primary' ?
            authentication.symmetricKey.primaryKey :
            authentication.symmetricKey.secondaryKey;
        const newSasTokenConnectionString = moduleIdentity ? generateSASTokenConnectionStringForModuleIdentity(
            activeAzureResourceHostName,
            moduleIdentity.deviceId,
            moduleIdentity.moduleId,
            sasTokenExpiration,
            selectedKey
        ) : generateSASTokenConnectionStringForDevice(
            activeAzureResourceHostName,
            deviceIdentity.deviceId,
            sasTokenExpiration,
            selectedKey
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
                        min={1}
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
