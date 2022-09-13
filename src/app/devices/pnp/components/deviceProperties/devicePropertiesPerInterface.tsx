/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DetailsList, DetailsListLayoutMode, IColumn, CheckboxVisibility, Label, Overlay, ActionButton, Dialog, Panel, PanelType } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { RenderSimplyTypeValue } from '../../../shared/components/simpleReportedSection';
import { ComplexReportedFormPanel } from '../../../shared/components/complexReportedFormPanel';
import { SemanticUnit } from '../../../../shared/units/components/semanticUnit';
import { EXTRA_LARGE_COLUMN_WIDTH, SMALL_COLUMN_WIDTH } from '../../../../constants/columnWidth';
import { TwinWithSchema } from './dataHelper';
import { getSchemaType, isSchemaSimpleType } from '../../../../shared/utils/jsonSchemaAdaptor';

export interface DevicePropertiesDataProps {
    twinAndSchema: TwinWithSchema[];
}

export const DevicePropertiesPerInterface: React.FC<DevicePropertiesDataProps> = (props: DevicePropertiesDataProps) => {
    const { t } = useTranslation();
    const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
    const [showReportedValuePanel, setShowReportedValuePanel] = React.useState<boolean>(false);
    const [selectedItem, setSelectedItem] = React.useState(undefined);

    const getColumns = (): IColumn[] => {
        return [
            { key: 'name', name: t(ResourceKeys.deviceProperties.columns.name), fieldName: 'name', minWidth: 100, maxWidth: EXTRA_LARGE_COLUMN_WIDTH, isResizable: true, isMultiline: true },
            { key: 'schema', name: t(ResourceKeys.deviceProperties.columns.schema), fieldName: 'schema', minWidth: 100, maxWidth: SMALL_COLUMN_WIDTH, isResizable: true, isMultiline: true },
            { key: 'unit', name: t(ResourceKeys.deviceProperties.columns.unit), fieldName: 'unit', minWidth: 100, maxWidth: SMALL_COLUMN_WIDTH, isResizable: true, isMultiline: true },
            { key: 'value', name: t(ResourceKeys.deviceProperties.columns.value), fieldName: 'value', minWidth: 150, isResizable: true, isMultiline: true }
        ];
    };

    const renderItemColumn = () => (item: TwinWithSchema, index: number, column: IColumn) => {
        switch (column.key) {
            case 'name':
                return renderPropertyName(item);
            case 'schema':
                return renderPropertySchema(item);
            case 'unit':
                return renderPropertyUnit(item);
            case 'value':
                return renderPropertyReportedValue(item);
            default:
                return;
        }
    };

    const renderPropertyName = (item: TwinWithSchema) => {
        const ariaLabel = t(ResourceKeys.deviceProperties.columns.name);
        let displayName = getLocalizedData(item.propertyModelDefinition.displayName);
        displayName = displayName ? displayName : '--';
        let description = getLocalizedData(item.propertyModelDefinition.description);
        description = description ? description : '--';
        return <Label aria-label={ariaLabel}>{item.propertyModelDefinition.name} ({displayName} / {description})</Label>;
    };

    const renderPropertySchema = (item: TwinWithSchema) => {
        const ariaLabel = t(ResourceKeys.deviceProperties.columns.schema);
        const propertyModelDefinition = item.propertyModelDefinition;
        const schemaType = getSchemaType(propertyModelDefinition.schema);
        return <Label aria-label={ariaLabel}>{schemaType}</Label>;
    };

    const renderPropertyUnit = (item: TwinWithSchema) => {
        const ariaLabel = t(ResourceKeys.deviceProperties.columns.unit);
        return (
            <Label aria-label={ariaLabel}>
                <SemanticUnit unitHost={item.propertyModelDefinition} />
            </Label>);
    };

    // tslint:disable-next-line:cyclomatic-complexity
    const renderPropertyReportedValue = (item: TwinWithSchema) => {
        if (!item) {
            return;
        }
        const ariaLabel = t(ResourceKeys.deviceProperties.columns.value);
        // tslint:disable-next-line:no-any
        const reportedValue = (item.reportedTwin as any)?.value || item.reportedTwin;
        // tslint:disable-next-line:no-any
        let displayValue = (item.propertyModelDefinition.schema as any)?.enumValues?.find((value: { enumValue: any; }) => value.enumValue === reportedValue)?.displayName || reportedValue;
        // tslint:disable-next-line:no-any
        displayValue = (displayValue as any)?.en || displayValue;
        return (
            <div aria-label={ariaLabel}>
                {
                    item.propertySchema && isSchemaSimpleType(item.propertyModelDefinition.schema, item.propertySchema.$ref) ?
                        RenderSimplyTypeValue(
                            item.reportedTwin,
                            item.propertySchema,
                            displayValue,
                            t(ResourceKeys.deviceProperties.columns.error)) :
                        item.reportedTwin ?
                            <ActionButton
                                className="column-value-button"
                                ariaDescription={t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                                onClick={onViewReportedValue(item)}
                            >
                                {t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                            </ActionButton> : <Label>--</Label>
                }
            </div>
        );
    };

    const onViewReportedValue = (item: TwinWithSchema) => () => {
        setSelectedItem(item);
        setShowOverlay(true);
        setShowReportedValuePanel(true);
    };

    const createReportedValuePanel = () => {
        if (!selectedItem) {
            return;
        }
        const { reportedTwin, propertyModelDefinition: modelDefinition, propertySchema: schema } = selectedItem;
        return (
            <Panel type={PanelType.medium} isOpen={showReportedValuePanel} isLightDismiss={true}>
                    <ComplexReportedFormPanel
                        showPanel={showReportedValuePanel}
                        formData={reportedTwin}
                        handleDismiss={removeOverlay}
                        schema={schema}
                        modelDefinition={modelDefinition}
                    />
            </Panel>
        );
    };

    const removeOverlay = () => {
        setSelectedItem(undefined);
        setShowOverlay(false);
    };

    return (
        <div className="pnp-detail-list scrollable-lg ms-Grid">
            <div className="list-detail pnp-properties">
                <DetailsList
                    checkboxVisibility={CheckboxVisibility.hidden}
                    onRenderItemColumn={renderItemColumn()}
                    items={props.twinAndSchema}
                    columns={getColumns()}
                    layoutMode={DetailsListLayoutMode.justified}
                />
                {showOverlay && <Overlay />}
                {createReportedValuePanel()}
            </div>
        </div>
    );
};
