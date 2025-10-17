/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Overlay, IColumn, Label, ActionButton, Panel, PanelType } from '@fluentui/react';
import { ResizableDetailsList } from '../../../../shared/resizeDetailsList/resizableDetailsList';
import { DeviceSettingsPerInterfacePerSetting } from './deviceSettingsPerInterfacePerSetting';
import '../../../../css/_devicePnpDetailList.scss';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { TwinWithSchema } from './dataHelper';
import { Twin } from '../../../../api/models/device';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { RenderSimplyTypeValue } from '../../../shared/components/simpleReportedSection';
import { ComplexReportedFormPanel } from '../../../shared/components/complexReportedFormPanel';
import { SemanticUnit } from '../../../../shared/units/components/semanticUnit';
import { getSchemaType, isSchemaSimpleType } from '../../../../shared/utils/jsonSchemaAdaptor';

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
    showReportedValuePanel: boolean;
    selectedItem: TwinWithSchema | undefined;
}

// tslint:disable-next-line: cyclomatic-complexity
export const DeviceSettingsPerInterface: React.FC<DeviceSettingDataProps & DeviceSettingDispatchProps> = (props: DeviceSettingDataProps & DeviceSettingDispatchProps) => {
    const { t } = useTranslation();
    const { twinWithSchema } = props;
    const initialCollapseMap = new Map();
    for (let index = 0; index < twinWithSchema.length; index ++) {
        initialCollapseMap.set(index, false);
    }
    const [ collapseMap, setCollapseMap ] = React.useState(initialCollapseMap);
    const [ showOverlay, setShowOverlay ] = React.useState<boolean>(false);
    const [ showReportedValuePanel, setShowReportedValuePanel ] = React.useState<boolean>(false);
    const [ selectedItem, setSelectedItem ] = React.useState<TwinWithSchema | undefined>(undefined);

    const handleCollapseToggle = (index: number) => () => {
        const newCollapseMap = new Map(collapseMap);
        newCollapseMap.set(index, !newCollapseMap.get(index));
        setCollapseMap(newCollapseMap);
    };

    const handleOverlayToggle = () => {
        setShowOverlay(!showOverlay);
    };

    const getColumns = (): IColumn[] => {
        return [
            { key: 'name', name: t(ResourceKeys.deviceSettings.columns.name), minWidth: 200, isMultiline: true },
            { key: 'schema', name: t(ResourceKeys.deviceSettings.columns.schema), minWidth: 100, isMultiline: true },
            { key: 'unit', name: t(ResourceKeys.deviceSettings.columns.unit), minWidth: 100, isMultiline: true },
            {
                key: 'desiredValue',
                name: t(ResourceKeys.deviceSettings.columns.desiredValue),
                minWidth: 500,
                isMultiline: true
            },
            {
                key: 'reportedValue',
                name: t(ResourceKeys.deviceSettings.columns.reportedValue),
                minWidth: 500,
                isMultiline: true
            }
        ];
    };

    const renderItemColumn = (item: TwinWithSchema, index: number, column: IColumn) => {
        switch (column.key) {
            case 'name':
                return renderPropertyName(item);
            case 'schema':
                return renderPropertySchema(item);
            case 'unit':
                return renderPropertyUnit(item);
            case 'reportedValue':
                return renderPropertyReportedValue(item);
            case 'desiredValue':
                return renderPropertyDesiredValue(item);
            default:
                return <></>;
        }
    };

    const renderPropertyName = (item: TwinWithSchema) => {
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.name);
        let displayName = getLocalizedData(item.settingModelDefinition.displayName);
        displayName = displayName ? displayName : '--';
        let description = getLocalizedData(item.settingModelDefinition.description);
        description = description ? description : '--';
        return <Label aria-label={ariaLabel}>{item.settingModelDefinition.name} ({displayName} / {description})</Label>;
    };

    const renderPropertySchema = (item: TwinWithSchema) => {
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.schema);
        const settingModelDefinition = item.settingModelDefinition;
        const schemaType = getSchemaType(settingModelDefinition.schema);
        return <Label aria-label={ariaLabel}>{schemaType}</Label>;
    };

    const renderPropertyUnit = (item: TwinWithSchema) => {
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.unit);
        return (
            <Label aria-label={ariaLabel}>
                <SemanticUnit unitHost={item.settingModelDefinition} />
            </Label>);
    };

    const settings = React.useMemo(() => {
        return twinWithSchema?.map((tuple, index) => (
            <DeviceSettingsPerInterfacePerSetting
                key={index}
                {...tuple}
                {...props}
                collapsed={collapseMap.get(index)}
                handleCollapseToggle={handleCollapseToggle(index)}
                handleOverlayToggle={handleOverlayToggle}
            />
        ));
    }, [collapseMap, props, twinWithSchema]);

    const renderPropertyReportedValue = (item: TwinWithSchema) => {
        if (!item) {
            return <></>;
        }
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.reportedValue);
        // tslint:disable-next-line:no-any
        const reportedValue = (item.reportedSection as any)?.value || item.reportedSection;
        // tslint:disable-next-line:no-any
        let displayValue = (item.settingModelDefinition.schema as any)?.enumValues?.find((value: { enumValue: any; }) => value.enumValue === reportedValue)?.displayName || reportedValue;
        // tslint:disable-next-line:no-any
        displayValue = (displayValue as any)?.en || displayValue;
        return (
            <div aria-label={ariaLabel}>
                {
                    item.settingSchema
                     && isSchemaSimpleType(item.settingModelDefinition.schema, item.settingSchema.$ref) 
                     ? RenderSimplyTypeValue(
                            item.reportedSection,
                            item.settingSchema,
                            displayValue) 
                     : item.reportedSection 
                        ?   <ActionButton
                                className="column-value-button"
                                ariaDescription={t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                                onClick={() => {onViewReportedValue(item)}}
                            >
                                {t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                            </ActionButton> 
                        : <Label>--</Label>
                }
            </div>
        );
    };

    const renderPropertyDesiredValue = (item: TwinWithSchema) => {
        if (!item) {
            return <></>;
        }
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.desiredValue);
    
        // Handle enum values display
        // tslint:disable-next-line:no-any
        let displayValue = (item.settingModelDefinition.schema as any)?.enumValues?.find((value: { enumValue: any; }) => value.enumValue === item.desiredValue)?.displayName || item.desiredValue;
        // tslint:disable-next-line:no-any
        displayValue = (displayValue as any)?.en || displayValue;

        const itemtoRender = item.settingSchema && 
            isSchemaSimpleType(item.settingModelDefinition.schema, item.settingSchema.$ref) 
            ?   RenderSimplyTypeValue(item.desiredValue, item.settingSchema, displayValue, true) 
            :   typeof item.desiredValue === 'object'  
                ?   (<ActionButton
                    className="column-value-button"
                    ariaDescription={t(ResourceKeys.deviceSettings.command.openDesiredValuePanel)}
                    onClick={() => {/* TODO: Implement desired value panel */}}
                    >
                        {t(ResourceKeys.deviceSettings.command.openDesiredValuePanel)}
                    </ActionButton>) 
                : <Label>{String(displayValue)}</Label>;

        return (
            <div aria-label={ariaLabel}>
                {itemtoRender}
                {settings}
            </div>
        );
    };

    const onViewReportedValue = React.useCallback((item: TwinWithSchema) => {
        setSelectedItem(item);
        setShowOverlay(true);
        setShowReportedValuePanel(true);
    }, []);

    const createReportedValuePanel = () => {
        if (!selectedItem) {
            return <></>;
        }
        const { reportedSection: reportedTwin, settingModelDefinition: modelDefinition, settingSchema: schema } = selectedItem;
        return (
            <Panel type={PanelType.medium} isOpen={showReportedValuePanel} isLightDismiss={true}>
                <ComplexReportedFormPanel
                    formData={reportedTwin}
                    schema={schema}
                    showPanel={showReportedValuePanel}
                    handleDismiss={removeOverlay}
                    modelDefinition={modelDefinition}
                />
            </Panel>
        );
    };

    const removeOverlay = () => {
        setSelectedItem(undefined);
        setShowOverlay(false);
        setShowReportedValuePanel(false);
    };

    return (
        <div className="pnp-detail-list pnp-properties scrollable-lg">
            <ResizableDetailsList
                items={twinWithSchema || []}
                columns={getColumns()}
                onRenderItemColumn={renderItemColumn}
                ariaLabelForSelectAllCheckbox={t(ResourceKeys.deviceSettings.columns.selectAll)}
                ariaLabelForSelectionColumn={t(ResourceKeys.deviceSettings.columns.toggleSelection)}
                checkButtonAriaLabel={t(ResourceKeys.deviceSettings.columns.rowCheckBoxAriaLabel)}
            />
            {createReportedValuePanel()}
            {showOverlay && <Overlay/>}
        </div>
    );
};
