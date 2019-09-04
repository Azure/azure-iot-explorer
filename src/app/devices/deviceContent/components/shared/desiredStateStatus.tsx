/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DesiredState } from '../../../../api/models/digitalTwinModels';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../..//shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { ACCEPT, WARNING, SYNCH } from '../../../../constants/iconNames';
import { DesiredStateStatus } from '../../../../constants/shared';

export const RenderDesiredState = (state: DesiredState) => {
    return (
        <LocalizationContextConsumer>
            {(context: LocalizationContextInterface) => (
                <LabelWithTooltip
                    tooltipText={state.description}
                >
                 {RenderStatusIcon(state.code, context)}
                </LabelWithTooltip>
            )}
        </LocalizationContextConsumer>
    );
};

export const RenderStatusIcon = (code: number, context: LocalizationContextInterface) => {
    switch (code) {
        case DesiredStateStatus.Success: return (
            <span className="status-success">
                <Icon className="status-icon" iconName={ACCEPT} />
                {context.t(ResourceKeys.deviceSettings.desiredState.success)}
            </span>
        );
        case DesiredStateStatus.Synching: return (
            <span className="status-synching">
                <Icon className="status-icon" iconName={SYNCH} />
                {context.t(ResourceKeys.deviceSettings.desiredState.synching)}
            </span>
        );
        case DesiredStateStatus.Error: return (
            <span className="status-error">
                <Icon className="status-icon" iconName={WARNING} />
                {context.t(ResourceKeys.deviceSettings.desiredState.error)}
            </span>
        );
        default: return (
            <span className="status-unknown">
                {context.t(ResourceKeys.deviceSettings.desiredState.unknown, {code})}
            </span>
        );
    }
};
