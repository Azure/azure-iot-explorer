/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ITextFieldProps, TextField } from 'office-ui-fabric-react/lib/components/TextField';
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
    const renderConsumerGroupLabel = (textFieldProps: ITextFieldProps) => (
        <LabelWithTooltip
            className={'consumer-group-label'}
            tooltipText={t(ResourceKeys.deviceEvents.consumerGroups.tooltip)}
        >
            {textFieldProps.label}
        </LabelWithTooltip>
    );

    const consumerGroupChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setConsumerGroup(newValue);
    };

    return (
        <TextField
            className={'consumer-group-text-field'}
            onRenderLabel={renderConsumerGroupLabel}
            label={t(ResourceKeys.deviceEvents.consumerGroups.label)}
            ariaLabel={t(ResourceKeys.deviceEvents.consumerGroups.label)}
            underlined={true}
            value={consumerGroup}
            disabled={monitoringData}
            onChange={consumerGroupChange}
        />
    );
};
