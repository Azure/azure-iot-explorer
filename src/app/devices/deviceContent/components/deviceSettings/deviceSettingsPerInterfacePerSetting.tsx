/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { ActionButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import ComplexReportedFormPanel from '../shared/complexReportedFormPanel';
import DataForm from '../shared/dataForm';
import { RenderSimplyTypeValue } from '../shared/simpleReportedSection';
import { PatchDigitalTwinActionParameters } from '../../actions';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { SemanticUnit } from '../../../../shared/units/components/semanticUnit';
import { JsonPatchOperation, PatchPayload } from '../../../../api/parameters/deviceParameters';
import { MetadataSection } from './selectors';
import { isValueDefined } from './../shared/dataForm';
import '../../../../css/_deviceSettings.scss';

export interface DeviceSettingDataProps extends TwinWithSchema {
    collapsed: boolean;
    deviceId: string;
    interfaceId: string;
    componentName: string;
}

export interface DeviceSettingDispatchProps {
    handleCollapseToggle: () => void;
    handleOverlayToggle: () => void;
    patchDigitalTwin: (parameters: PatchDigitalTwinActionParameters) => void;
}

export interface TwinWithSchema {
    isComponentContainedInDigitalTwin: boolean;
    metadata: MetadataSection;
    reportedTwin: boolean | string | number | object;
    settingModelDefinition: PropertyContent;
    settingSchema: ParsedJsonSchema;
}

interface DeviceSettingState {
    showReportedValuePanel: boolean;
}

export default class DeviceSettingsPerInterfacePerSetting
    extends React.Component<DeviceSettingDataProps & DeviceSettingDispatchProps, DeviceSettingState> {
    constructor(props: DeviceSettingDataProps & DeviceSettingDispatchProps) {
        super(props);

        this.state = {
            showReportedValuePanel: false
        };
    }

    public render(): JSX.Element {
        return (
            <article className="list-item pnp-properties" role="listitem">
                <LocalizationContextConsumer>
                    {(context: LocalizationContextInterface) => (
                        <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                            {this.createCollapsedSummary(context)}
                            {this.createUncollapsedCard()}
                            {this.createReportedValuePanel()}
                        </ErrorBoundary>
                    )}
                </LocalizationContextConsumer>
            </article>
        );
    }

    private readonly isSchemaSimpleType = () => {
        return this.props.settingSchema && (
            typeof this.props.settingModelDefinition.schema === 'string' ||
            this.props.settingModelDefinition.schema['@type'].toLowerCase() === 'enum');
    }

    private readonly createCollapsedSummary = (context: LocalizationContextInterface) => {
        return (
            <header className={`flex-grid-row item-summary ${this.props.collapsed ? '' : 'item-summary-uncollapsed'}`} onClick={this.props.handleCollapseToggle}>
                {this.renderPropertyName(context)}
                {this.renderPropertySchema(context)}
                {this.renderPropertyUnit(context)}
                {this.renderReportedValueAndMetadata(context)}
                {this.renderCollapseButton(context)}
            </header>
        );
    }

    private readonly renderPropertyName = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceSettings.columns.name);
        let displayName = getLocalizedData(this.props.settingModelDefinition.displayName);
        displayName = displayName ? displayName : '--';
        let description = getLocalizedData(this.props.settingModelDefinition.description);
        description = description ? description : '--';
        return <div className="col-sm3"><Label aria-label={ariaLabel}>{this.props.settingModelDefinition.name} ({displayName} / {description})</Label></div>;
    }

    private readonly renderPropertySchema = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.schema);
        const { settingModelDefinition } = this.props;
        const schemaType = typeof settingModelDefinition.schema === 'string' ?
            settingModelDefinition.schema :
            settingModelDefinition.schema['@type'];
        return <div className="col-sm2"><Label aria-label={ariaLabel}>{schemaType}</Label></div>;
    }

    private readonly renderPropertyUnit = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceProperties.columns.unit);

        return (
            <div className="col-sm2">
                <Label aria-label={ariaLabel}>
                    <SemanticUnit unitHost={this.props.settingModelDefinition} />
                </Label>
            </div>);
    }

    private readonly renderReportedValueAndMetadata = (context: LocalizationContextInterface) => {
        const { metadata } = this.props;
        const ariaLabel = context.t(ResourceKeys.deviceSettings.columns.reportedValue);
        return (
            <div className="column-value-text col-sm4" aria-label={ariaLabel}>
                <Stack horizontal={true}>
                    <Stack.Item align="start" className="reported-property">
                        {this.renderReportedValue(context)}
                    </Stack.Item>
                    {metadata &&
                        <Stack.Item align="start" className={`${this.isSchemaSimpleType() ? 'reported-status' : 'reported-status-complex'} `}>
                            {metadata.ackCode && `(${metadata.ackCode} ${metadata.ackDescription})`}
                        </Stack.Item>
                    }
                </Stack>
            </div>
        );
    }

    private readonly renderReportedValue = (context: LocalizationContextInterface) => {
        const { reportedTwin } = this.props;
        return (
            <>
                {isValueDefined(reportedTwin) ?
                    (this.isSchemaSimpleType() ?
                        RenderSimplyTypeValue(
                            reportedTwin,
                            this.props.settingSchema,
                            context.t(ResourceKeys.deviceSettings.columns.error)) :
                        <ActionButton
                            className="column-value-button"
                            ariaDescription={context.t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                            onClick={this.onViewReportedValue}
                        >
                            {context.t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                        </ActionButton>
                    ) : <Label>--</Label>
                }
            </>
        );
    }

    private readonly renderCollapseButton = (context: LocalizationContextInterface) => {
        return (
        <div className="col-sm1">
            <IconButton
                title={context.t(this.props.collapsed ? ResourceKeys.deviceSettings.command.expand : ResourceKeys.deviceSettings.command.collapse)}
                iconProps={{iconName: this.props.collapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
            />
        </div>);
    }

    private readonly createUncollapsedCard = () => {
        return (
            <section className={this.props.collapsed ? 'item-detail' : 'item-detail item-detail-uncollapsed'}>
                {!this.props.collapsed && this.createForm()}
            </section>
        );
    }

    private readonly getSettingSchema = () => {
        const { settingModelDefinition } = this.props;
        return typeof settingModelDefinition.schema === 'string' ?
            settingModelDefinition.schema :
            settingModelDefinition.schema['@type'];
    }

    private readonly createReportedValuePanel = () => {
        const { reportedTwin, settingModelDefinition : modelDefinition, settingSchema : schema } = this.props;
        return (
            <div role="dialog">
                {this.state.showReportedValuePanel &&
                    <ComplexReportedFormPanel
                        schema={schema}
                        modelDefinition={modelDefinition}
                        showPanel={this.state.showReportedValuePanel}
                        formData={reportedTwin}
                        handleDismiss={this.handleDismissViewReportedPanel}
                    />}
            </div>
        );
    }

    private readonly onViewReportedValue = () => {
        this.setState({showReportedValuePanel: true});
        this.props.handleOverlayToggle();
        this.props.handleCollapseToggle();
    }

    private readonly handleDismissViewReportedPanel = () => {
        this.setState({showReportedValuePanel: false});
        this.props.handleOverlayToggle();
    }

    private readonly createForm = () => {
        return (
            <DataForm
                buttonText={ResourceKeys.deviceSettings.command.submit}
                formData={this.props.metadata && this.props.metadata.desiredValue}
                settingSchema={this.props.settingSchema}
                handleSave={this.onSubmit}
                craftPayload={this.createSettingsPayload}
                componentName={this.props.componentName}
                schema={this.getSettingSchema()}
            />
        );
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private readonly createSettingsPayload = (twin: boolean | number | string | object): PatchPayload[] => {
        const { componentName, metadata, isComponentContainedInDigitalTwin, settingModelDefinition } = this.props;
        if (!isComponentContainedInDigitalTwin) {
            const value: any = { // tslint:disable-line: no-any
                $metadata: {}
            };
            value[settingModelDefinition.name] = twin;
            return[{
                op: JsonPatchOperation.ADD,
                path: `/${componentName}`,
                value
            }];
        }
        else {
            const patchPayloadWithTwin = isValueDefined(twin) ? {
                op: metadata && metadata.desiredValue ?
                    JsonPatchOperation.REPLACE : JsonPatchOperation.ADD,
                path: `/${componentName}/${settingModelDefinition.name}`,
                value: twin,
            } : {
                op: JsonPatchOperation.REMOVE,
                path: `/${componentName}/${settingModelDefinition.name}`,
            };
            return[patchPayloadWithTwin];
        }
    }

    private readonly onSubmit = (twin: boolean | number | string | object) => () => {
        this.props.patchDigitalTwin({
            digitalTwinId: this.props.deviceId,
            payload: this.createSettingsPayload(twin)
        });
    }
}
