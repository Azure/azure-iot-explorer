/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Field, Switch } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { TimePicker } from '@fluentui/react-timepicker-compat';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import './deviceEvents.scss';

export interface StartTimeProps {
    monitoringData: boolean;
    specifyStartTime: boolean;
    startTime: Date;
    setSpecifyStartTime: (specifyStartTime: boolean) => void;
    setStartTime: (date: Date | undefined) => void;
    setHasError: (hasError: boolean) => void;
}

export const StartTime: React.FC<StartTimeProps> = ({monitoringData, specifyStartTime, startTime, setSpecifyStartTime, setStartTime, setHasError}) => {

    const { t } = useTranslation();
    const datePickerId = React.useId();
    const timePickerId = React.useId();
    const [timeError, setTimeError] = React.useState<boolean>(false);
    const [timeSelected, setTimeSelected] = React.useState<boolean>(false);
    const [timePickerKey, setTimePickerKey] = React.useState<number>(0);

    const toggleChange = () => {
        if (!specifyStartTime && !startTime) {
            setStartTime(new Date());
            setHasError(false);
        }
        setSpecifyStartTime(!specifyStartTime);
    };

    const onDateChange = (date: Date | null | undefined) => {
        if (date) {
            const updated = new Date(date);
            updated.setHours(0, 0, 0, 0);
            setStartTime(updated);
            setHasError(false);
            setTimeError(false);
            setTimeSelected(false);
            setTimePickerKey(prev => prev + 1);
        }
        else {
            setStartTime(undefined);
            setHasError(true);
            setTimeError(false);
            setTimeSelected(false);
            setTimePickerKey(prev => prev + 1);
        }
    };

    const parseTimeText = (timeText: string): Date | null => {
        const match = timeText.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (!match) {
            return null;
        }
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3]?.toUpperCase();

        if (period) {
            if (hours < 1 || hours > 12 || minutes > 59) { return null; }
            if (period === 'AM' && hours === 12) { hours = 0; }
            else if (period === 'PM' && hours !== 12) { hours += 12; }
        } else {
            if (hours > 23 || minutes > 59) { return null; }
        }

        const result = startTime ? new Date(startTime) : new Date();
        result.setHours(hours, minutes, 0, 0);
        return result;
    };

    const onTimeChange = (_ev: any, data: { selectedTime: Date; selectedTimeText?: string; errorType?: string }) => {
        if (data.selectedTime) {
            const updated = startTime ? new Date(startTime) : new Date();
            updated.setHours(data.selectedTime.getHours(), data.selectedTime.getMinutes(), 0, 0);
            setStartTime(updated);
            setHasError(false);
            setTimeError(false);
            setTimeSelected(true);
        }
        else if (data.selectedTimeText) {
            const parsed = parseTimeText(data.selectedTimeText.trim());
            if (parsed) {
                setStartTime(parsed);
                setHasError(false);
                setTimeError(false);
                setTimeSelected(true);
            } else {
                setHasError(true);
                setTimeError(true);
            }
        }
        else {
            setHasError(true);
            setTimeError(true);
        }
    };

    return (
        <div className="horizontal-item">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Switch
                    className="stack-first-column"
                    checked={specifyStartTime}
                    aria-label={t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.label)}
                    label={t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.label)}
                    onChange={toggleChange}
                    disabled={monitoringData}
                />
                {specifyStartTime &&
                    <div className="stack-second-column" style={{ display: 'flex', flexDirection: 'column' }}>
                        <LabelWithTooltip
                            className={'consumer-group-label'}
                            tooltipText={t(ResourceKeys.deviceEvents.startTime.tooltip)}
                            htmlFor={datePickerId}
                        >
                            {t(ResourceKeys.deviceEvents.startTime.label)}
                        </LabelWithTooltip>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
                            <DatePicker
                                id={datePickerId}
                                value={startTime || null}
                                onSelectDate={onDateChange}
                                disabled={monitoringData}
                                placeholder="Select date"
                                style={{ width: '180px' }}
                            />
                            <Field
                                validationMessage={timeError ? t(ResourceKeys.deviceEvents.startTime.error) : undefined}
                                validationState={timeError ? 'error' : 'none'}
                            >
                                <TimePicker
                                    key={timePickerKey}
                                    id={timePickerId}
                                    aria-label={t(ResourceKeys.deviceEvents.startTime.label) + ' - time'}
                                    selectedTime={timeSelected ? startTime || null : null}
                                    dateAnchor={startTime || new Date()}
                                    onTimeChange={onTimeChange}
                                    disabled={monitoringData}
                                    placeholder="Select time"
                                    increment={15}
                                    freeform={true}
                                    style={{ width: '140px' }}
                                />
                            </Field>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};
