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
    customEventHubConnectionString: string;
    setUseBuiltInEventHub: (monitoringData: boolean) => void;
    setCustomEventHubConnectionString: (customEventHubConnectionString: string) => void;
    setHasError: (hasError: boolean) => void;
}

export const CustomEventHub: React.FC<CustomEventHubProps> = ({
    monitoringData,
    useBuiltInEventHub,
    customEventHubConnectionString,
    setUseBuiltInEventHub,
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
                </Stack>
            }
        </Stack>
    );
};
