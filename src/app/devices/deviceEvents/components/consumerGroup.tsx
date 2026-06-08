/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@fluentui/react-components';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import './deviceEvents.scss';

export interface ConsumerGroupProps {
    monitoringData: boolean;
    consumerGroup: string;
    setConsumerGroup: (consumerGroup: string) => void;
}

export const ConsumerGroup: React.FC<ConsumerGroupProps> = ({monitoringData, consumerGroup, setConsumerGroup}) => {

    const { t } = useTranslation();
    const consumerGroupChange = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
        setConsumerGroup(data.value);
    };

    return (
        <div className={'consumer-group-text-field'}>
            <LabelWithTooltip
                className={'consumer-group-label'}
                tooltipText={t(ResourceKeys.deviceEvents.consumerGroups.tooltip)}
            >
                {t(ResourceKeys.deviceEvents.consumerGroups.label)}
            </LabelWithTooltip>
            <Input
                appearance="underline"
                aria-label={t(ResourceKeys.deviceEvents.consumerGroups.label)}
                value={consumerGroup}
                disabled={monitoringData}
                onChange={consumerGroupChange}
            />
        </div>
    );
};
