/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import ComplexReportedFormPanel from '../shared/complexReportedFormPanel';
import { RenderSimplyTypeValue } from '../shared/simpleReportedSection';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';

export type TwinWithSchema = DevicePropertyDataProps;

export interface DevicePropertyDataProps {
    propertyModelDefinition: PropertyContent;
    propertySchema: ParsedJsonSchema;
    reportedTwin: any; // tslint:disable-line:no-any
}

export interface DevicePropertyDispatchProps {
    handleOverlayToggle: () => void;
}

interface DevicePropertyState {
    showReportedValuePanel: boolean;
}

export default class DevicePropertiesPerInterfacePerProperty
    extends React.Component<DevicePropertyDataProps & DevicePropertyDispatchProps, DevicePropertyState> {
    constructor(props: DevicePropertyDataProps & DevicePropertyDispatchProps) {
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
                        <section className="item-summary">
                            <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                                {this.renderPropertyName(context)}
                                {this.renderPropertySchema(context)}
                                {this.renderPropertyUnit(context)}
                                {this.renderPropertyReportedValue(context)}
                                {this.createReportedValuePanel()}
                            </ErrorBoundary>
                        </section>
                    )}
                </LocalizationContextConsumer>
            </article>
        );
    }

    private readonly renderPropertyName = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.name);
        let displayName = getLocalizedData(this.props.propertyModelDefinition.displayName);
        displayName = displayName ? displayName : '--';
        let description = getLocalizedData(this.props.propertyModelDefinition.description);
        description = description ? description : '--';
        return <div className="ms-Grid-col ms-sm3"><Label aria-label={ariaLabel}>{this.props.propertyModelDefinition.name} ({displayName} / {description})</Label></div>;
    }

    private readonly renderPropertySchema = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.schema);
        const { propertyModelDefinition } = this.props;
        const schemaType = typeof propertyModelDefinition.schema === 'string' ?
            propertyModelDefinition.schema :
            propertyModelDefinition.schema['@type'];
        return <div className="ms-Grid-col ms-sm3"><Label aria-label={ariaLabel}>{schemaType}</Label></div>;
    }

    private readonly renderPropertyUnit = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.unit);
        const unit = this.props.propertyModelDefinition.unit;
        return <div className="ms-Grid-col ms-sm3"><Label aria-label={ariaLabel}>{unit ? unit : '--'}</Label></div>;
    }

    private readonly renderPropertyReportedValue = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.value);
        return (
            <div className="column-value-text ms-Grid-col ms-sm3" aria-label={ariaLabel}>
                {this.props.reportedTwin ?
                    (this.isSchemaSimpleType() ?
                        RenderSimplyTypeValue(
                            this.props.reportedTwin,
                            this.props.propertySchema,
                            context.t(ResourceKeys.deviceProperties.columns.error)) :
                        <ActionButton
                            className="column-value-button"
                            ariaDescription={context.t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                            onClick={this.onViewReportedValue}
                        >
                            {context.t(ResourceKeys.deviceProperties.command.openReportedValuePanel)}
                        </ActionButton>
                    ) : <Label>--</Label>
                }
            </div>
        );
    }

    private readonly onViewReportedValue = () => {
        this.setState({showReportedValuePanel: true});
        this.props.handleOverlayToggle();
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
        this.props.handleOverlayToggle();
    }
}
