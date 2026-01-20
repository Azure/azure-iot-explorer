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
            { isMultiline: true, key: 'name', minWidth: 200, name: t(ResourceKeys.deviceSettings.columns.name) },
            { isMultiline: true, key: 'schema', minWidth: 100, name: t(ResourceKeys.deviceSettings.columns.schema) },
            { isMultiline: true, key: 'unit', minWidth: 100, name: t(ResourceKeys.deviceSettings.columns.unit) },
            {
                isMultiline: true,
                key: 'desiredValue',
                minWidth: 500,
                name: t(ResourceKeys.deviceSettings.columns.desiredValue)
            },
            {
                isMultiline: true,
                key: 'reportedValue',
                minWidth: 500,
                name: t(ResourceKeys.deviceSettings.columns.reportedValue)
            }
        ];
    };

    const renderItemColumn = (item: TwinWithSchema, index: number, column: IColumn) => {
        const columnRenderers: Record<string, () => JSX.Element> = {
            desiredValue: () => renderPropertyDesiredValue(item),
            name: () => renderPropertyName(item),
            reportedValue: () => renderPropertyReportedValue(item),
            schema: () => renderPropertySchema(item),
            unit: () => renderPropertyUnit(item)
        };
        const renderer = columnRenderers[column.key];
        return renderer ? renderer() : <></>;
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

    const settings = React.useMemo(
        () => {
            return twinWithSchema?.map((tuple, index) =>
                (
                    <DeviceSettingsPerInterfacePerSetting
                        key={index}
                        {...tuple}
                        {...props}
                        collapsed={collapseMap.get(index)}
                        handleCollapseToggle={handleCollapseToggle(index)}
                        handleOverlayToggle={handleOverlayToggle}
                    />
                ));
        },
        [collapseMap, props, twinWithSchema]
    );

    const onViewReportedValue = React.useCallback(
        (item: TwinWithSchema) => {
            setSelectedItem(item);
            setShowOverlay(true);
            setShowReportedValuePanel(true);
        },
        []
    );

    const createOnViewReportedValueHandler = React.useCallback(
        (item: TwinWithSchema) => () => {
            onViewReportedValue(item);
        },
        [onViewReportedValue]
    );

    // tslint:disable-next-line:no-any
    const getDisplayValue = (schema: any, value: any) => {
        // tslint:disable-next-line:no-any
        const enumMatch = schema?.enumValues?.find((v: { enumValue: any; }) => v.enumValue === value)?.displayName;
        const result = enumMatch || value;
        // tslint:disable-next-line:no-any
        return (result as any)?.en || result;
    };

    // tslint:disable-next-line:cyclomatic-complexity
    const renderPropertyReportedValue = (item: TwinWithSchema) => {
        if (!item) {
            return <></>;
        }
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.reportedValue);
        // tslint:disable-next-line:no-any
        const reportedValue = (item.reportedSection as any)?.value || item.reportedSection;
        const displayValue = getDisplayValue(item.settingModelDefinition.schema, reportedValue);

        const isSimpleType = item.settingSchema && isSchemaSimpleType(item.settingModelDefinition.schema, item.settingSchema.$ref);

        const renderContent = () => {
            if (isSimpleType) {
                return RenderSimplyTypeValue(item.reportedSection, item.settingSchema, displayValue);
            }
            if (item.reportedSection) {
                return (
                    <ActionButton
                        className="column-value-button"
                        ariaDescription={t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                        onClick={createOnViewReportedValueHandler(item)}
                    >
                        {t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                    </ActionButton>
                );
            }
            return <Label>--</Label>;
        };

        return (
            <div aria-label={ariaLabel}>
                {renderContent()}
            </div>
        );
    };

    // tslint:disable-next-line:no-empty
    const onOpenDesiredValuePanel = React.useCallback(() => { /* TODO: Implement desired value panel */ }, []);

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

        const isSimpleType = item.settingSchema && isSchemaSimpleType(item.settingModelDefinition.schema, item.settingSchema.$ref);

        const renderItemContent = () => {
            if (isSimpleType) {
                return RenderSimplyTypeValue(item.desiredValue, item.settingSchema, displayValue, true);
            }
            if (typeof item.desiredValue === 'object') {
                return (
                    <ActionButton
                        className="column-value-button"
                        ariaDescription={t(ResourceKeys.deviceSettings.command.openDesiredValuePanel)}
                        onClick={onOpenDesiredValuePanel}
                    >
                        {t(ResourceKeys.deviceSettings.command.openDesiredValuePanel)}
                    </ActionButton>
                );
            }
            return <Label>{String(displayValue)}</Label>;
        };

        return (
            <div aria-label={ariaLabel}>
                {renderItemContent()}
                {settings}
            </div>
        );
    };

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
