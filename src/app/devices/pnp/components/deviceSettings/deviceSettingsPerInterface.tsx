/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { Overlay } from 'office-ui-fabric-react/lib/components/Overlay';
import { DeviceSettingsPerInterfacePerSetting } from './deviceSettingsPerInterfacePerSetting';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
import { LabelWithTooltip } from '../../../../shared/components/labelWithTooltip';
import { TwinWithSchema } from './dataHelper';
import '../../../../css/_devicePnpDetailList.scss';
import { Twin } from '../../../../api/models/device';

export interface DeviceSettingDataProps {
    deviceId: string;
    moduleId: string;
    interfaceId: string;
    componentName: string;
    twinWithSchema: TwinWithSchema[];
}

export interface DeviceSettingDispatchProps {
    patchTwin: (parameters: Twin) => void;
}

export interface DeviceSettingState {
    collapseMap: Map<number, boolean>;
    allCollapsed: boolean;
    showOverlay: boolean;
}

// tslint:disable-next-line: cyclomatic-complexity
export const DeviceSettingsPerInterface: React.FC<DeviceSettingDataProps & DeviceSettingDispatchProps> = (props: DeviceSettingDataProps & DeviceSettingDispatchProps) => {
    const { t } = useTranslation();
    const { twinWithSchema } = props;
    const initialCollapseMap = new Map();
    for (let index = 0; index < twinWithSchema.length; index ++) {
        initialCollapseMap.set(index, false);
    }
    const [ allCollapsed, setAllCollapsed ] = React.useState<boolean>(false);
    const [ collapseMap, setCollapseMap ] = React.useState(initialCollapseMap);
    const [ showOverlay, setShowOverlay ] = React.useState<boolean>(false);

    const renderCollapseAllButton = () => {
        return (
            <div className="col-sm1 collapse-button">
                <IconButton
                    iconProps={{iconName: allCollapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
                    ariaLabel={allCollapsed ?
                        t(ResourceKeys.deviceSettings.command.expandAll) :
                        t(ResourceKeys.deviceSettings.command.collapseAll)}
                    onClick={onToggleCollapseAll}
                    title={t(allCollapsed ? ResourceKeys.deviceSettings.command.expandAll : ResourceKeys.deviceSettings.command.collapseAll)}
                />
            </div>
        );
    };

    const onToggleCollapseAll = () => {
        const newCollapseMap = new Map();
        for (let index = 0; index < collapseMap.size; index ++) {
            newCollapseMap.set(index, !allCollapsed);
        }
        setCollapseMap(newCollapseMap);
        setAllCollapsed(!allCollapsed);
    };

    const handleCollapseToggle = (index: number) => () => {
        const newCollapseMap = new Map(collapseMap);
        newCollapseMap.set(index, !newCollapseMap.get(index));
        setCollapseMap(newCollapseMap);
    };

    const handleOverlayToggle = () => {
        setShowOverlay(!showOverlay);
    };

    const settings = twinWithSchema && twinWithSchema.map((tuple, index) => (
        <DeviceSettingsPerInterfacePerSetting
            key={index}
            {...tuple}
            {...props}
            collapsed={collapseMap.get(index)}
            handleCollapseToggle={handleCollapseToggle(index)}
            handleOverlayToggle={handleOverlayToggle}
        />
    ));

    return (
        <div className="pnp-detail-list pnp-properties scrollable-lg">
            <div className="list-header flex-grid-row">
                <span className="col-sm3">{t(ResourceKeys.deviceSettings.columns.name)}</span>
                <span className="col-sm2">{t(ResourceKeys.deviceSettings.columns.schema)}</span>
                <span className="col-sm2">{t(ResourceKeys.deviceSettings.columns.unit)}</span>
                <span className="col-sm4 reported-value">
                    <LabelWithTooltip tooltipText={t(ResourceKeys.deviceSettings.columns.reportedValueTooltip)}>
                        {t(ResourceKeys.deviceSettings.columns.reportedValue)}
                    </LabelWithTooltip>
                </span>
                {renderCollapseAllButton()}
            </div>
            <section role={twinWithSchema && twinWithSchema.length === 0 ? 'main' : 'list'} className="list-content">
                {settings}
            </section>
            {showOverlay && <Overlay/>}
        </div>
    );
};
