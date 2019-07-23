/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard, SUBMIT } from '../../../../constants/iconNames';
import { ParsedCommandSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { CommandContent } from '../../../../api/models/modelDefinition';
import DataForm from '../shared/dataForm';
import { InvokeDigitalTwinInterfaceCommandActionParameters } from '../../actions';
import { generateCommandPayload } from '../../sagas/digitalTwinInterfaceCommandSaga';

export interface DeviceCommandDataProps extends CommandSchema {
    collapsed: boolean;
    deviceId: string;
    interfaceName: string;
}

export interface DeviceCommandDispatchProps {
    handleCollapseToggle: () => void;
    invokeDigitalTwinInterfaceCommand: (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => void;
}

export interface CommandSchema {
    parsedSchema: ParsedCommandSchema;
    commandModelDefinition: CommandContent;
}

export default class DeviceCommandsPerInterfacePerCommand
    extends React.Component<DeviceCommandDataProps & DeviceCommandDispatchProps> {

    public render(): JSX.Element {
        const commandForm = (
            <article className="list-item" role="listitem">
                <LocalizationContextConsumer >
                    {(context: LocalizationContextInterface) => (
                        <>
                            {this.createCollapsedSummary(context)}
                            {this.createUncollapsedCard(context)}
                        </>
                    )}
                </LocalizationContextConsumer>
            </article>
        );

        return (commandForm);
    }

    private readonly createCollapsedSummary = (context: LocalizationContextInterface) => {
        return (
            <header className={this.props.collapsed ? 'item-summary' : 'item-summary item-summary-uncollapsed'} onClick={this.handleToggleCollapse}>
                {this.renderCommandName(context)}
                <IconButton
                    title={context.t(this.props.collapsed ? ResourceKeys.deviceCommands.command.expand : ResourceKeys.deviceCommands.command.collapse)}
                    className="column-toggle"
                    iconProps={{iconName: this.props.collapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
                />
            </header>
        );
    }

    private readonly createUncollapsedCard = (context: LocalizationContextInterface) => {
        return (
            <section className={this.props.collapsed ? 'item-detail' : 'item-detail item-detail-uncollapsed'}>
                {!this.props.collapsed &&
                <>
                    {this.renderCommandSchemaInformation(context)}
                    {this.props.commandModelDefinition.request ? this.createForm() :
                        <PrimaryButton
                            className="submit-button"
                            onClick={this.onSubmit({})}
                            text={context.t(ResourceKeys.deviceCommands.command.submit)}
                            iconProps={{ iconName: SUBMIT }}
                        />
                    }
                </>
                }
            </section>
        );
    }

    private readonly createForm = () => {
        return (
            <DataForm
                buttonText={ResourceKeys.deviceCommands.command.submit}
                formData={undefined}
                interfaceName={this.props.interfaceName}
                settingSchema={this.props.parsedSchema.requestSchema}
                handleSave={this.onSubmit}
                craftPayload={this.craftCommandPayload}
                schema={this.getRequestSchema()}
            />
        );
    }

    private readonly craftCommandPayload = (interfaceName: string, propertyKey: string, payload: object) => {
      return generateCommandPayload(propertyKey, payload);
    }

    private readonly renderCommandSchemaInformation = (context: LocalizationContextInterface) => {
        const { commandModelDefinition } = this.props;
        return (
            <section className="schema-info-section">
                <Label>
                    {context.t(ResourceKeys.deviceCommands.details.description)}: {commandModelDefinition.description ? commandModelDefinition.description : '--'}
                </Label>
                <Label>{context.t(ResourceKeys.deviceCommands.details.schema)}: {this.getRequestSchema()}</Label>
                <Label>
                    {context.t(ResourceKeys.deviceCommands.details.type)}: {commandModelDefinition.commandType ? commandModelDefinition.commandType : '--'}
                </Label>
            </section>
        );
    }

    private readonly getRequestSchema = () => {
        const { commandModelDefinition } = this.props;
        const schema = commandModelDefinition.request;
        if (!schema) {
            return '--';
        }
        else {
            return typeof schema.schema === 'string' ?
            schema.schema :
            schema.schema['@type'];
        }
    }

    private readonly renderCommandName = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceCommands.columns.name);
        const displayName = this.props.commandModelDefinition.displayName;
        return <Label aria-label={ariaLabel} className="column-name">{this.props.commandModelDefinition.name} ({displayName ? displayName : '--'})</Label>;
    }

    private readonly onSubmit = (data: any) => () => { // tslint:disable-line:no-any
        this.props.invokeDigitalTwinInterfaceCommand({
            commandName: this.props.commandModelDefinition.name,
            commandPayload: data,
            digitalTwinId: this.props.deviceId,
            propertyKey: this.props.commandModelDefinition.request && this.props.commandModelDefinition.request.name
        });
    }

    private readonly handleToggleCollapse = () => {
        this.props.handleCollapseToggle();
    }
}
