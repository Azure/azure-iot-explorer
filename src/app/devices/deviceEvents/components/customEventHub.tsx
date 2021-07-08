/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Toggle, TextField, Stack } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { isValidEventHubConnectionString } from '../../../shared/utils/hubConnectionStringHelper';
import './deviceEvents.scss';

export interface CustomEventHubProps {
    monitoringData: boolean;
    useBuiltInEventHub: boolean;
    customEventHubName: string;
    customEventHubConnectionString: string;
    setUseBuiltInEventHub: (monitoringData: boolean) => void;
    setCustomEventHubName: (customEventHubName: string) => void;
    setCustomEventHubConnectionString: (customEventHubConnectionString: string) => void;
    setHasError: (hasError: boolean) => void;
}

export const CustomEventHub: React.FC<CustomEventHubProps> = ({
    monitoringData,
    useBuiltInEventHub,
    customEventHubName,
    customEventHubConnectionString,
    setUseBuiltInEventHub,
    setCustomEventHubName,
    setCustomEventHubConnectionString,
    setHasError}) => {

    const { t } = useTranslation();
    const [ error, setError ] = React.useState<string>();

    React.useEffect(() => {
        if (!isValidEventHubConnectionString(customEventHubConnectionString)) {
            setError(t(ResourceKeys.deviceEvents.customEventHub.connectionString.error));
            setHasError(true);
        }
        else {
            setError('');
            setHasError(false);
        }
    },              [customEventHubConnectionString]);

    const toggleChange = () => {
        setUseBuiltInEventHub(!useBuiltInEventHub);
    };

    const customEventHubConnectionStringChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCustomEventHubConnectionString(newValue);
    };

    const customEventHubNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCustomEventHubName(newValue);
    };

    return (
        <Stack horizontal={true} horizontalAlign="space-between">
            <Toggle
                className="stack-first-column"
                checked={useBuiltInEventHub}
                ariaLabel={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                label={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                onText={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.on)}
                offText={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.off)}
                onChange={toggleChange}
                disabled={monitoringData}
            />
            {!useBuiltInEventHub &&
                <Stack horizontal={false} className="stack-second-column">
                    <TextField
                        className="custom-text-field"
                        label={t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                        ariaLabel={t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                        underlined={true}
                        value={customEventHubConnectionString}
                        disabled={monitoringData}
                        onChange={customEventHubConnectionStringChange}
                        placeholder={t(ResourceKeys.deviceEvents.customEventHub.connectionString.placeHolder)}
                        errorMessage={error}
                        required={true}
                    />
                    <TextField
                        className="custom-text-field"
                        label={t(ResourceKeys.deviceEvents.customEventHub.name.label)}
                        ariaLabel={t(ResourceKeys.deviceEvents.customEventHub.name.label)}
                        underlined={true}
                        value={customEventHubName}
                        disabled={monitoringData}
                        onChange={customEventHubNameChange}
                        required={true}
                    />
                </Stack>
            }
        </Stack>
    );
};
