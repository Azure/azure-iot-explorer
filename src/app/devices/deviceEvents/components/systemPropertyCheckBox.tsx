
import * as React from 'react';
import { Checkbox } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { useDeviceEventsStateContext } from '../context/deviceEventsStateContext';

export interface SystemPropertyCheckBoxProps {
    showSystemProperties: boolean;
    showPnpModeledEvents: boolean;
    setShowSystemProperties: (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => void;
}

export const SystemPropertyCheckBox: React.FC<SystemPropertyCheckBoxProps> = ({showSystemProperties, showPnpModeledEvents, setShowSystemProperties}) => {
    const {t} = useTranslation();
    const [ state, ] = useDeviceEventsStateContext();
    return (
        <Checkbox
            checked={showSystemProperties}
            label={t(ResourceKeys.deviceEvents.command.showSystemProperties.label)}
            ariaLabel={t(ResourceKeys.deviceEvents.command.showSystemProperties.label)}
            disabled={state.formMode === 'updating' || showPnpModeledEvents}
            onChange={setShowSystemProperties}
            styles={{ root: { paddingTop: 10 } }}
        />
    );
};
