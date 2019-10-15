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
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';

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
                        <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                            <div className="ms-Grid-row">
                                {this.createCollapsedSummary(context)}
                                {this.createUncollapsedCard(context)}
                            </div>
                        </ErrorBoundary>
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
                {this.renderCommandSchema(context, true)}
                {this.renderCommandSchema(context, false)}
                {this.renderCommandType(context)}
                {this.renderCollapseButton(context)}
            </header>
        );
    }

    private readonly createUncollapsedCard = (context: LocalizationContextInterface) => {
        return (
            <section className={this.props.collapsed ? 'item-detail' : 'item-detail item-detail-uncollapsed'}>
                {!this.props.collapsed &&
                <>
                    {this.props.commandModelDefinition.request ? this.createForm() :
                        <div className="value-section">
                            <PrimaryButton
                                className="submit-button"
                                onClick={this.onSubmit(null)}
                                text={context.t(ResourceKeys.deviceCommands.command.submit)}
                                iconProps={{ iconName: SUBMIT }}
                            />
                        </div>
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
                schema={this.getCommandSchema(true)}
            />
        );
    }

    private readonly craftCommandPayload = (payload: object) => {
      return generateCommandPayload(payload);
    }

    private readonly getCommandSchema = (isRequest: boolean) => {
        const { commandModelDefinition } = this.props;
        const schema = isRequest ?
            commandModelDefinition.request :
            commandModelDefinition.response;
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
        let displayName = getLocalizedData(this.props.commandModelDefinition.displayName);
        displayName = displayName ? displayName : '--';
        let description = getLocalizedData(this.props.commandModelDefinition.description);
        description = description ? description : '--';
        return <div className="ms-Grid-col ms-sm3"><Label aria-label={ariaLabel}>{this.props.commandModelDefinition.name} ({displayName} / {description})</Label></div>;
    }

    private readonly renderCommandSchema = (context: LocalizationContextInterface, isRequest: boolean) => {
        const ariaLabel = context.t(ResourceKeys.deviceCommands.columns.type);
        return <div className="ms-Grid-col ms-sm3"><Label aria-label={ariaLabel}>{this.getCommandSchema(isRequest)}</Label></div>;
    }

    private readonly renderCommandType = (context: LocalizationContextInterface) => {
        const ariaLabel = context.t(ResourceKeys.deviceCommands.columns.schema.request);
        const { commandModelDefinition } = this.props;
        return <div className="ms-Grid-col ms-sm2"><Label aria-label={ariaLabel}>{commandModelDefinition.commandType ? commandModelDefinition.commandType : '--'}</Label></div>;
    }

    private readonly renderCollapseButton = (context: LocalizationContextInterface) => {
        return (
        <div className="ms-Grid-col ms-sm1">
            <IconButton
                title={context.t(this.props.collapsed ? ResourceKeys.deviceCommands.command.expand : ResourceKeys.deviceCommands.command.collapse)}
                iconProps={{iconName: this.props.collapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
            />
        </div>);
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
