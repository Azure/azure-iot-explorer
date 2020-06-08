/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { DeviceCommandsPerInterfacePerCommand, CommandSchema } from './deviceCommandsPerInterfacePerCommand';
import { InvokeDigitalTwinInterfaceCommandActionParameters } from '../../actions';
import { useLocalizationContext } from '../../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../../constants/iconNames';
import '../../../../../css/_devicePnpDetailList.scss';

export interface DeviceCommandDataProps {
    commandSchemas: CommandSchema[];
    deviceId: string;
    componentName: string;
}

export interface DeviceCommandDispatchProps {
    invokeDigitalTwinInterfaceCommand: (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => void;
}

export interface DeviceCommandState {
    collapseMap: Map<number, boolean>;
    allCollapsed: boolean;
}

export const DeviceCommandsPerInterface: React.FC<DeviceCommandDataProps & DeviceCommandDispatchProps> = (props: DeviceCommandDataProps & DeviceCommandDispatchProps) => {
    const { commandSchemas } = props;
    const { t } = useLocalizationContext();

    const initialCollapseMap = new Map();
    for (let index = 0; index < commandSchemas.length; index ++) {
        initialCollapseMap.set(index, false);
    }
    const [ allCollapsed, setAllCollapsed ] = React.useState<boolean>(false);
    const [ collapseMap, setCollapseMap ] = React.useState(initialCollapseMap);

    const renderCollapseAllButton = () => {
        return (
            <div className="col-sm1 collapse-button">
                <IconButton
                    iconProps={{iconName: allCollapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
                    ariaLabel={allCollapsed ?
                        t(ResourceKeys.deviceCommands.command.expandAll) :
                        t(ResourceKeys.deviceCommands.command.collapseAll)}
                    onClick={onToggleCollapseAll}
                    title={t(allCollapsed ? ResourceKeys.deviceCommands.command.expandAll : ResourceKeys.deviceCommands.command.collapseAll)}
                />
            </div>
        );
    };

    const onToggleCollapseAll = () => {
        const newCollapseMap = new Map();
        for (let index = 0; index < collapseMap.size; index ++) {
            newCollapseMap.set(index, !allCollapsed);
        }
        setAllCollapsed(!allCollapsed);
        setCollapseMap(newCollapseMap);
    };

    const handleCollapseToggle = (index: number) => () => {
        const newCollapseMap = new Map(collapseMap);
        newCollapseMap.set(index, !newCollapseMap.get(index));
        setCollapseMap(newCollapseMap);
    };

    const commands = commandSchemas && commandSchemas.map((schema, index) => (
        <DeviceCommandsPerInterfacePerCommand
            key={index}
            {...props}
            {...schema}
            collapsed={collapseMap.get(index)}
            handleCollapseToggle={handleCollapseToggle(index)}
        />
    ));

    return (
        <div className="pnp-detail-list scrollable-lg">
            <div className="list-header flex-grid-row">
                <span className="col-sm3">{t(ResourceKeys.deviceCommands.columns.name)}</span>
                <span className="col-sm3">{t(ResourceKeys.deviceCommands.columns.schema.request)}</span>
                <span className="col-sm3">{t(ResourceKeys.deviceCommands.columns.schema.response)}</span>
                <span className="col-sm2">{t(ResourceKeys.deviceCommands.columns.type)}</span>
                {renderCollapseAllButton()}
            </div>
            <section role={commandSchemas && commandSchemas.length === 0 ? 'main' : 'list'} className="list-content">
                {commands}
            </section>
        </div>
    );
};
