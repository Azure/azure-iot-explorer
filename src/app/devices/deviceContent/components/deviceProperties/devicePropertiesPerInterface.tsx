/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import ComplexReportedFormPanel from '../shared/complexReportedFormPanel';
import { RenderSimplyTypeValue } from '../shared/simpleReportedSection';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { SMALL_COLUMN_WIDTH, EXTRA_LARGE_COLUMN_WIDTH } from '../../../../constants/columnWidth';

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

export default class DevicePropertiesPerInterface
    extends React.Component<DevicePropertiesDataProps, DevicePropertiesState> {
    constructor(props: DevicePropertiesDataProps) {
        super(props);

        this.state = {
            showOverlay: false,
            showReportedValuePanel: false
        };
    }

    public render(): JSX.Element {

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="pnp-detail-list scrollable-lg ms-Grid">
                        <div className="list-detail pnp-properties">
                            <DetailsList
                                checkboxVisibility={CheckboxVisibility.hidden}
                                onRenderItemColumn={this.renderItemColumn(context)}
                                items={this.props.twinAndSchema}
                                columns={this.getColumns(context)}
                                layoutMode={DetailsListLayoutMode.justified}
                            />
                            {this.state.showOverlay && <Overlay/>}
                            {this.createReportedValuePanel()}
                        </div>
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly getColumns = (context: LocalizationContextInterface): IColumn[] => {
        return [
            { key: 'name', name: context.t(ResourceKeys.deviceProperties.columns.name), fieldName: 'name', minWidth: 100, maxWidth: EXTRA_LARGE_COLUMN_WIDTH, isResizable: true, isMultiline: true },
            { key: 'schema', name: context.t(ResourceKeys.deviceProperties.columns.schema), fieldName: 'schema', minWidth: 100, maxWidth: SMALL_COLUMN_WIDTH, isResizable: true, isMultiline: true },
            { key: 'unit', name: context.t(ResourceKeys.deviceProperties.columns.unit), fieldName: 'unit', minWidth: 100, maxWidth: SMALL_COLUMN_WIDTH, isResizable: true, isMultiline: true },
            { key: 'value', name: context.t(ResourceKeys.deviceProperties.columns.value), fieldName: 'value', minWidth: 150, isResizable: true, isMultiline: true }
        ];
    }

    private readonly renderItemColumn = (context: LocalizationContextInterface) => (item: TwinWithSchema, index: number, column: IColumn) => {
        switch (column.key) {
            case 'name':
                return this.renderPropertyName(context, item);
            case 'schema':
                return this.renderPropertySchema(context, item);
            case 'unit':
                return this.renderPropertyUnit(context, item);
            case 'value':
                return this.renderPropertyReportedValue(context, item);
            default:
                return;
        }
    }

    private readonly renderPropertyName = (context: LocalizationContextInterface, item: TwinWithSchema) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.name);
        let displayName = getLocalizedData(item.propertyModelDefinition.displayName);
        displayName = displayName ? displayName : '--';
        let description = getLocalizedData(item.propertyModelDefinition.description);
        description = description ? description : '--';
        return <Label aria-label={ariaLabel}>{item.propertyModelDefinition.name} ({displayName} / {description})</Label>;
    }

    private readonly renderPropertySchema = (context: LocalizationContextInterface, item: TwinWithSchema) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.schema);
        const propertyModelDefinition = item.propertyModelDefinition;
        const schemaType = typeof propertyModelDefinition.schema === 'string' ?
            propertyModelDefinition.schema :
            propertyModelDefinition.schema['@type'];
        return <Label aria-label={ariaLabel}>{schemaType}</Label>;
    }

    private readonly renderPropertyUnit = (context: LocalizationContextInterface, item: TwinWithSchema) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.unit);
        const unit = item.propertyModelDefinition.unit;
        return <Label aria-label={ariaLabel}>{unit ? unit : '--'}</Label>;
    }

    private readonly renderPropertyReportedValue = (context: LocalizationContextInterface, item: TwinWithSchema) => {
        if (!item) {
            return;
        }
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.value);
        return (
            <div aria-label={ariaLabel}>
                {item.reportedTwin || typeof item.reportedTwin === 'boolean' ?
                    (this.isSchemaSimpleType(item) ?
                        RenderSimplyTypeValue(
                            item.reportedTwin,
                            item.propertySchema,
                            context.t(ResourceKeys.deviceProperties.columns.error)) :
                        <ActionButton
                            className="column-value-button"
                            ariaDescription={context.t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                            onClick={this.onViewReportedValue(item)}
                        >
                            {context.t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                        </ActionButton>
                    ) : <Label>--</Label>
                }
            </div>
        );
    }

    private readonly onViewReportedValue = (item: TwinWithSchema) => () => {
        this.setState({
            selectedItem: item,
            showOverlay: true,
            showReportedValuePanel: true,
        });
    }

    private readonly isSchemaSimpleType = (item: TwinWithSchema) => {
        return item.propertySchema &&
            (typeof item.propertyModelDefinition.schema === 'string' ||
            item.propertyModelDefinition.schema['@type'].toLowerCase() === 'enum');
    }

    private readonly createReportedValuePanel = () => {
        if (!this.state.selectedItem) {
            return;
        }
        const { reportedTwin, propertyModelDefinition : modelDefinition, propertySchema : schema } = this.state.selectedItem;
        return (
            <div role="dialog">
                {this.state.showReportedValuePanel &&
                    <ComplexReportedFormPanel
                        showPanel={this.state.showReportedValuePanel}
                        formData={reportedTwin}
                        handleDismiss={this.removeOverlay}
                        schema={schema}
                        modelDefinition={modelDefinition}
                    />}
            </div>
        );
    }

    private readonly removeOverlay = () => {
        this.setState({
            selectedItem: undefined,
            showOverlay: false
        });
    }
}
