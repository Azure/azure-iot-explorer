/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import ComplexReportedFormPanel from '../shared/complexReportedFormPanel';
import { RenderSimplyTypeValue } from '../shared/simpleReportedSection';

export type TwinWithSchema = DevicePropertyProps;

export interface DevicePropertyProps {
    propertyModelDefinition: PropertyContent;
    propertySchema: ParsedJsonSchema;
    reportedTwin: any; // tslint:disable-line:no-any
}

interface DevicePropertyState {
    showReportedValuePanel: boolean;
}

export default class DevicePropertiesPerInterfacePerProperty
    extends React.Component<DevicePropertyProps, DevicePropertyState> {
    constructor(props: DevicePropertyProps) {
        super(props);

        this.state = {
            showReportedValuePanel: false
        };
    }

    public render(): JSX.Element {
        return (
            <article className="list-item" role="listitem">
                <LocalizationContextConsumer>
                    {(context: LocalizationContextInterface) => (
                        <section className="item-oneline">
                            {this.renderPropertyName(context)}
                            {this.renderPropertySchema(context)}
                            {this.renderPropertyUnit(context)}
                            {this.renderPropertyReportedValue(context)}
                            {this.state.showReportedValuePanel && this.createReportedValuePanel()}
                        </section>
                    )}
                </LocalizationContextConsumer>
            </article>
        );
    }

    private readonly renderPropertyName = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.name);
        const displayName = this.props.propertyModelDefinition.displayName;
        return <Label aria-label={ariaLabel} className="column-name">{this.props.propertyModelDefinition.name} ({displayName ? displayName : '--'})</Label>;
    }

    private readonly renderPropertySchema = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.schema);
        const { propertyModelDefinition } = this.props;
        const schemaType = typeof propertyModelDefinition.schema === 'string' ?
            propertyModelDefinition.schema :
            propertyModelDefinition.schema['@type'];
        return <Label aria-label={ariaLabel} className="column-schema">{schemaType}</Label>;
    }

    private readonly renderPropertyUnit = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.unit);
        const unit = this.props.propertyModelDefinition.unit;
        return <Label aria-label={ariaLabel} className="column-unit">{unit ? unit : '--'}</Label>;
    }

    private readonly renderPropertyReportedValue = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.value);
        return (
            <div className="column-value-text" aria-label={ariaLabel}>
                {this.props.reportedTwin ?
                    (this.isSchemaSimpleType() ?
                        RenderSimplyTypeValue(
                            this.props.reportedTwin,
                            this.props.propertySchema,
                            context.t(ResourceKeys.deviceProperties.columns.error)) :
                        <DefaultButton
                            className="column-value-button"
                            ariaDescription={context.t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                            onClick={this.onViewReportedValue}
                        >
                            {context.t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                        </DefaultButton>
                    ) : <Label>--</Label>
                }
            </div>
        );
    }

    private readonly onViewReportedValue = () => {
        this.setState({showReportedValuePanel: true});
    }

    private readonly isSchemaSimpleType = () => {
        return this.props.propertySchema &&
            (typeof this.props.propertyModelDefinition.schema === 'string' ||
            this.props.propertyModelDefinition.schema['@type'].toLowerCase() === 'enum');
    }

    private readonly createReportedValuePanel = () => {
        const { reportedTwin, propertyModelDefinition : modelDefinition, propertySchema : schema } = this.props;
        return (
            <div role="dialog">
                {this.state.showReportedValuePanel &&
                    <ComplexReportedFormPanel
                        showPanel={this.state.showReportedValuePanel}
                        formData={reportedTwin}
                        handleDismiss={this.handleDismissViewReportedPanel}
                        schema={schema}
                        modelDefinition={modelDefinition}
                    />}
            </div>
        );
    }

    private readonly handleDismissViewReportedPanel = () => {
        this.setState({showReportedValuePanel: false});
    }
}
