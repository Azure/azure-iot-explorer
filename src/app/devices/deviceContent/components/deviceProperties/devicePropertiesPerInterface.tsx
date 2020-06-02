/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { ComplexReportedFormPanel } from '../shared/complexReportedFormPanel';
import { RenderSimplyTypeValue } from '../shared/simpleReportedSection';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { SMALL_COLUMN_WIDTH, EXTRA_LARGE_COLUMN_WIDTH } from '../../../../constants/columnWidth';
import { SemanticUnit } from '../../../../shared/units/components/semanticUnit';
import { isValueDefined } from '../shared/dataForm';

export interface DevicePropertiesDataProps {
    twinAndSchema: TwinWithSchema[];
}

export interface TwinWithSchema {
    propertyModelDefinition: PropertyContent;
    propertySchema: ParsedJsonSchema;
    reportedTwin: boolean | string | number | object;
}

export interface DevicePropertiesState {
    showOverlay: boolean;
    showReportedValuePanel: boolean;
    selectedItem?: TwinWithSchema;
}

export const DevicePropertiesPerInterface: React.FC<DevicePropertiesDataProps> = (props: DevicePropertiesDataProps) => {
    const { t } = useLocalizationContext();
    const [ showOverlay, setShowOverlay ] = React.useState<boolean>(false);
    const [ showReportedValuePanel, setShowReportedValuePanel ] = React.useState<boolean>(false);
    const [ selectedItem, setSelectedItem ] = React.useState(undefined);

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
        const schemaType = typeof propertyModelDefinition.schema === 'string' ?
            propertyModelDefinition.schema :
            propertyModelDefinition.schema['@type'];
        return <Label aria-label={ariaLabel}>{schemaType}</Label>;
    };

    const renderPropertyUnit = (item: TwinWithSchema) => {
        const ariaLabel = t(ResourceKeys.deviceProperties.columns.unit);
        return (
            <Label aria-label={ariaLabel}>
                <SemanticUnit unitHost={item.propertyModelDefinition} />
            </Label>);
    };

    const renderPropertyReportedValue = (item: TwinWithSchema) => {
        if (!item) {
            return;
        }
        const ariaLabel = t(ResourceKeys.deviceProperties.columns.value);
        return (
            <div aria-label={ariaLabel}>
                {isValueDefined(item.reportedTwin) ?
                    (isSchemaSimpleType(item) ?
                        RenderSimplyTypeValue(
                            item.reportedTwin,
                            item.propertySchema,
                            t(ResourceKeys.deviceProperties.columns.error)) :
                        <ActionButton
                            className="column-value-button"
                            ariaDescription={t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                            onClick={onViewReportedValue(item)}
                        >
                            {t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                        </ActionButton>
                    ) : <Label>--</Label>
                }
            </div>
        );
    };

    const onViewReportedValue = (item: TwinWithSchema) => () => {
        setSelectedItem(item);
        setShowOverlay(true);
        setShowReportedValuePanel(true);
    };

    const isSchemaSimpleType = (item: TwinWithSchema) => {
        return item.propertySchema &&
            (typeof item.propertyModelDefinition.schema === 'string' ||
            item.propertyModelDefinition.schema['@type'].toLowerCase() === 'enum');
    };

    const createReportedValuePanel = () => {
        if (!selectedItem) {
            return;
        }
        const { reportedTwin, propertyModelDefinition : modelDefinition, propertySchema : schema } = selectedItem;
        return (
            <div role="dialog">
                {showReportedValuePanel &&
                    <ComplexReportedFormPanel
                        showPanel={showReportedValuePanel}
                        formData={reportedTwin}
                        handleDismiss={removeOverlay}
                        schema={schema}
                        modelDefinition={modelDefinition}
                    />}
            </div>
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
                {showOverlay && <Overlay/>}
                {createReportedValuePanel()}
            </div>
        </div>
    );
};
