/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Field, Input, Switch } from '@fluentui/react-components';
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

    const customEventHubConnectionStringChange = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
        setCustomEventHubConnectionString(data.value);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Switch
                className="stack-first-column"
                checked={useBuiltInEventHub}
                aria-label={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                label={t(ResourceKeys.deviceEvents.toggleUseDefaultEventHub.label)}
                onChange={toggleChange}
                disabled={monitoringData}
            />
            {!useBuiltInEventHub &&
                <div className="stack-second-column" style={{ display: 'flex', flexDirection: 'column' }}>
                    <Field
                        label={t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                        validationMessage={error || undefined}
                        validationState={error ? 'error' : 'none'}
                        required={true}
                    >
                        <Input
                            className="custom-text-field"
                            appearance="underline"
                            aria-label={t(ResourceKeys.deviceEvents.customEventHub.connectionString.label)}
                            value={customEventHubConnectionString}
                            disabled={monitoringData}
                            onChange={customEventHubConnectionStringChange}
                            placeholder={t(ResourceKeys.deviceEvents.customEventHub.connectionString.placeHolder)}
                        />
                    </Field>
                </div>
            }
        </div>
    );
};
