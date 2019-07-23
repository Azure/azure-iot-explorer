/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label, Stack } from 'office-ui-fabric-react';
import { IconButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { SYNC_STATUS } from '../../../../constants/shared';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import ComplexReportedFormPanel from '../shared/complexReportedFormPanel';
import DataForm from '../shared/dataForm';
import { RenderSimplyTypeValue } from '../shared/simpleReportedSection';
import { RenderDesiredState } from '../shared/desiredStateStatus';
import { PatchDigitalTwinInterfacePropertiesActionParameters } from '../../actions';
import { Reported } from '../../../../api/models/digitalTwinModels';
import '../../../../css/_deviceSettings.scss';
import { generateInterfacePropertiesPayload } from '../../sagas/digitalTwinInterfacePropertySaga';

export interface DeviceSettingDataProps extends TwinWithSchema {
    collapsed: boolean;
    deviceId: string;
    interfaceId: string;
    interfaceName: string;
}

export interface DeviceSettingDispatchProps {
    handleCollapseToggle: () => void;
    patchDigitalTwinInterfaceProperties: (parameters: PatchDigitalTwinInterfacePropertiesActionParameters) => void;
}

export interface TwinWithSchema {
    desiredTwin: any; // tslint:disable-line: no-any
    reportedTwin: Reported; // tslint:disable-line: no-any

    settingModelDefinition: PropertyContent;
    settingSchema: ParsedJsonSchema;
    syncStatus: SYNC_STATUS;
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
            <article className="list-item" role="listitem">
                <LocalizationContextConsumer>
                    {(context: LocalizationContextInterface) => (
                        <>
                            {this.createCollapsedSummary(context)}
                            {this.createUncollapsedCard(context)}
                            {this.state.showReportedValuePanel && <Overlay/>}
                            {this.state.showReportedValuePanel && this.createReportedValuePanel()}
                        </>
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
            <header className={this.props.collapsed ? 'item-summary' : 'item-summary item-summary-uncollapsed'} onClick={this.handleToggleCollapse}>
                {this.renderPropertyName(context)}
                {this.renderPropertyReportedValue(context)}
                <IconButton
                    title={context.t(this.props.collapsed ? ResourceKeys.deviceSettings.command.expand : ResourceKeys.deviceSettings.command.collapse)}
                    className="column-toggle"
                    iconProps={{iconName: this.props.collapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
                />
            </header>
        );
    }

    private readonly renderPropertyName = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceSettings.columns.name);
        const displayName = this.props.settingModelDefinition.displayName;
        return <Label aria-label={ariaLabel} className="column-name">{this.props.settingModelDefinition.name} ({displayName ? displayName : '--'})</Label>;
    }

    private readonly renderPropertyReportedValue = (context: LocalizationContextInterface) => {
        const { reportedTwin } = this.props;
        const ariaLabel = context.t(ResourceKeys.deviceSettings.columns.reportedValue);
        return (
            <div className="column-value-text" aria-label={ariaLabel}>
                <Stack horizontal={true} gap={'25px'}>
                    <Stack.Item align="start" className="reported-property">
                        {reportedTwin ?
                            (this.isSchemaSimpleType() ?
                                RenderSimplyTypeValue(
                                    reportedTwin.value,
                                    this.props.settingSchema,
                                    context.t(ResourceKeys.deviceSettings.columns.error)) :
                                <DefaultButton
                                    className="column-value-button"
                                    ariaDescription={context.t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                                    onClick={this.onViewReportedValue}
                                >
                                    {context.t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                                </DefaultButton>
                            ) : <Label>--</Label>
                        }
                    </Stack.Item>
                    {reportedTwin && reportedTwin.desiredState &&
                    <Stack.Item align="end">
                        {RenderDesiredState(reportedTwin.desiredState)}
                    </Stack.Item>
                    }
                </Stack>
            </div>
        );
    }

    private readonly createUncollapsedCard = (context: LocalizationContextInterface) => {
        return (
            <section className={this.props.collapsed ? 'item-detail' : 'item-detail item-detail-uncollapsed'}>
                {!this.props.collapsed &&
                <>
                    {this.renderPropertySchemaInformation(context)}
                    {this.createForm()}
                </>
                }
            </section>
        );
    }

    private readonly renderPropertySchemaInformation = (context: LocalizationContextInterface) => {
        const { settingModelDefinition } = this.props;
        return (
            <section className="schema-info-section">
                <Label>
                    {context.t(ResourceKeys.deviceSettings.details.description)}: {settingModelDefinition.description ? settingModelDefinition.description : '--'}
                </Label>
                <Label>{context.t(ResourceKeys.deviceSettings.details.schema)}: {this.getSettingSchema()}</Label>
                <Label>
                    {context.t(ResourceKeys.deviceSettings.details.unit)}: {settingModelDefinition.displayUnit ? settingModelDefinition.displayUnit : '--'}
                </Label>
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
        this.handleToggleCollapse();
    }

    private readonly handleDismissViewReportedPanel = () => {
        this.setState({showReportedValuePanel: false});
    }

    private readonly handleToggleCollapse = () => {
        this.props.handleCollapseToggle();
    }

    private readonly createForm = () => {
        return (
            <DataForm
                buttonText={ResourceKeys.deviceSettings.command.submit}
                formData={this.props.desiredTwin}
                settingSchema={this.props.settingSchema}
                handleSave={this.onSubmit}
                craftPayload={this.createSettingsPayload}
                interfaceName={this.props.interfaceName}
                schema={this.getSettingSchema()}
            />
        );
    }
    private readonly createSettingsPayload = (interfaceName: string, propertyKey: string, patchData: object) => {
        return generateInterfacePropertiesPayload(interfaceName, propertyKey, patchData);
    }
    private readonly onSubmit = (twin: any) => () => { // tslint:disable-line:no-any
        this.props.patchDigitalTwinInterfaceProperties({
            digitalTwinId: this.props.deviceId,
            interfacesPatchData: twin,
            propertyKey: this.props.settingModelDefinition.name
        });
    }
}
