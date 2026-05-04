/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@fluentui/react-components';
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
    setStartTime: (date: Date) => void;
    setHasError: (hasError: boolean) => void;
}

export const StartTime: React.FC<StartTimeProps> = ({monitoringData, specifyStartTime, startTime, setSpecifyStartTime, setStartTime, setHasError}) => {

    const { t } = useTranslation();
    const datePickerId = React.useId();
    const timePickerId = React.useId();

    const toggleChange = () => {
        if (!specifyStartTime && !startTime) {
            setStartTime(new Date());
            setHasError(false);
        }
        setSpecifyStartTime(!specifyStartTime);
    };

    const onDateChange = (date: Date | null | undefined) => {
        if (date) {
            const updated = startTime ? new Date(startTime) : new Date();
            updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            setStartTime(updated);
            setHasError(false);
        }
        else {
            setStartTime(undefined);
            setHasError(true);
        }
    };

    const onTimeChange = (_ev: any, data: { selectedTime: Date; selectedTimeText?: string; errorType?: string }) => {
        if (data.errorType || !data.selectedTime) {
            setHasError(true);
        }
        else {
            const updated = startTime ? new Date(startTime) : new Date();
            updated.setHours(data.selectedTime.getHours(), data.selectedTime.getMinutes(), 0, 0);
            setStartTime(updated);
            setHasError(false);
        }
    };

    return (
        <div className="horizontal-item">
            <div className={'consumer-group-text-field'}>
                <LabelWithTooltip
                    className={'consumer-group-label'}
                    tooltipText={t(ResourceKeys.deviceEvents.startTime.tooltip)}
                >
                    {t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.label)}
                </LabelWithTooltip>
                <Switch
                    checked={specifyStartTime}
                    label={specifyStartTime ?
                        t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.on) :
                        t(ResourceKeys.deviceEvents.toggleSpecifyStartingTime.off)}
                    onChange={toggleChange}
                    disabled={monitoringData}
                />
            </div>
            {specifyStartTime &&
                <div className={'consumer-group-text-field'}>
                    <LabelWithTooltip
                        className={'consumer-group-label'}
                        tooltipText={t(ResourceKeys.deviceEvents.startTime.tooltip)}
                        htmlFor={datePickerId}
                    >
                        {t(ResourceKeys.deviceEvents.startTime.label)}
                    </LabelWithTooltip>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <DatePicker
                            id={datePickerId}
                            value={startTime || null}
                            onSelectDate={onDateChange}
                            disabled={monitoringData}
                            placeholder="Select date"
                            style={{ width: '180px' }}
                        />
                        <TimePicker
                            id={timePickerId}
                            aria-label={t(ResourceKeys.deviceEvents.startTime.label) + ' - time'}
                            selectedTime={startTime || null}
                            dateAnchor={startTime || new Date()}
                            onTimeChange={onTimeChange}
                            disabled={monitoringData}
                            placeholder="Select time"
                            increment={15}
                            input={{ readOnly: true }}
                            style={{ width: '140px' }}
                        />
                    </div>
                </div>
            }
        </div>
    );
};
