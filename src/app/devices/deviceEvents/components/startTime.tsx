/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Toggle, Stack } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import './deviceEvents.scss';

export interface StartTimeProps {
    monitoringData: boolean;
    specifyStartTime: boolean;
    startTime: Date;
    setSpecifyStartTime: (specifyStartTime: boolean) => void;
    setStartTime: (date: Date) => void;
    setHasError: (hasError: boolean) => void;
}

export const StartTime: React.FC<StartTimeProps> = ({monitoringData, specifyStartTime, startTime, setSpecifyStartTime, setStartTime, setHasError}) => {

    const { t } = useTranslation();
    const [ error, setError ] = React.useState<string>();
    const [ startTimeString, setStartTimeString ] = React.useState<string>();

    React.useEffect(() => {
        setStartTimeString(startTime &&
            `${startTime.getFullYear()}/${startTime.getMonth() + 1}/${startTime.getDate()}/${startTime.getHours()}/${startTime.getMinutes()}/${startTime.getSeconds()}`);
    },              [startTime]);

    React.useEffect(() => {
        const pattern = new RegExp('^[0-9]{4}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/(00|[0-9]|1[0-9]|2[0-3])\/([0-9]|[0-5][0-9])\/([0-9]|[0-5][0-9])$');
        if (pattern.test(startTimeString)) {
            const dateStringSplit = startTimeString.split('/');
            const dateSplit = dateStringSplit.map(date => parseInt(date)); // tslint:disable-line:radix
            // with the regex check, the date is guaranteed to be in yyyy/mm/dd/hh/mm/ss format
            setStartTime(new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], dateSplit[3], dateSplit[4], dateSplit[5])); // tslint:disable-line:no-magic-numbers
            setError('');
            setHasError(false);
        }
        else {
            setError(t(ResourceKeys.deviceEvents.startTime.error));
            setHasError(true);
        }
    },              [startTimeString]);

    const toggleChange = () => {
        setSpecifyStartTime(!specifyStartTime);
    };

    const renderToggleLabel = () => (
        <LabelWithTooltip
            className={'consumer-group-label'}
            tooltipText={t(ResourceKeys.deviceEvents.startTime.tooltip)}
        >
            {t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.label)}
        </LabelWithTooltip>
    );

    const startTimeChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setStartTimeString(newValue);
    };

    return (
        <Stack horizontal={true} horizontalAlign="space-between">
            <Toggle
                className="stack-first-column"
                checked={specifyStartTime}
                ariaLabel={t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.label)}
                label={renderToggleLabel()}
                onText={t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.on)}
                offText={t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.off)}
                onChange={toggleChange}
                disabled={monitoringData}
            />
            <div className="stack-second-column">
                {specifyStartTime &&
                    <TextField
                        className="custom-text-field"
                        label={t(ResourceKeys.deviceEvents.startTime.label)}
                        ariaLabel={t(ResourceKeys.deviceEvents.startTime.label)}
                        underlined={true}
                        value={startTimeString}
                        disabled={monitoringData}
                        onChange={startTimeChange}
                        errorMessage={error}
                        placeholder={'yyyy/mm/dd/hh/mm/ss'}
                        required={true}
                    />
                }
            </div>
        </Stack>
    );
};
