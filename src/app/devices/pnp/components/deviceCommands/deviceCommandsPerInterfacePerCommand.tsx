/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Label } from '@fluentui/react-components';
import { ChevronDownRegular, ChevronUpRegular, CloudArrowUpRegular } from '@fluentui/react-icons';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { ParsedCommandSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { CommandContent } from '../../../../api/models/modelDefinition';
import { DataForm } from '../../../shared/components/dataForm';
import { InvokeCommandActionParameters } from '../../actions';
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { LiveRegion } from '../../../../shared/components/liveRegion';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { getSchemaType } from '../../../../shared/utils/jsonSchemaAdaptor';
import { CONNECTION_TIMEOUT_IN_SECONDS, DEFAULT_COMPONENT_FOR_DIGITAL_TWIN, RESPONSE_TIME_IN_SECONDS } from '../../../../constants/devices';
import { SendCommandConfirmation } from './sendCommandConfirmation';

export interface DeviceCommandDataProps extends CommandSchema {
    collapsed: boolean;
    deviceId: string;
    moduleId: string;
    componentName: string;
}

export interface DeviceCommandDispatchProps {
    handleCollapseToggle: () => void;
    invokeCommand: (parameters: InvokeCommandActionParameters) => void;
}

export interface CommandSchema {
    parsedSchema: ParsedCommandSchema;
    commandModelDefinition: CommandContent;
}

export const DeviceCommandsPerInterfacePerCommand: React.FC<DeviceCommandDataProps & DeviceCommandDispatchProps> = (props: DeviceCommandDataProps & DeviceCommandDispatchProps) => {
    const { t } = useTranslation();
    const { collapsed, deviceId, moduleId, componentName, commandModelDefinition, parsedSchema, handleCollapseToggle, invokeCommand  } = props;
    const [ showConfirmationDialog, setShowConfirmationDialog ] = React.useState<boolean>(false);
    const [ confirmationCmdData, setConfirmationCmdData ] = React.useState({});
    const [ announcement, setAnnouncement ] = React.useState('');

    const createCollapsedSummary = () => {
        return (
            <header className={`flex-grid-row item-summary ${collapsed ? '' : 'item-summary-uncollapsed'}`} onClick={handleToggleCollapse}>
                {renderCommandName()}
                {renderCommandSchema(true)}
                {renderCommandSchema(false)}
                {renderCommandType()}
                {renderCollapseButton()}
            </header>
        );
    };

    const createUncollapsedCard = () => {
        return (
            <section className={collapsed ? 'item-detail' : 'item-detail item-detail-uncollapsed'}>
                {!collapsed &&
                <>
                    {commandModelDefinition.request ? createForm() :
                        <div className="value-section">
                            <Button
                                appearance="primary"
                                className="submit-button"
                                onClick={onSubmit(null)}
                                icon={<CloudArrowUpRegular />}
                            >
                                {t(ResourceKeys.deviceCommands.command.submit)}
                            </Button>
                        </div>
                    }
                </>
                }
            </section>
        );
    };

    const createForm = () => {
        return (
            <DataForm
                buttonText={ResourceKeys.deviceCommands.command.submit}
                formData={undefined}
                settingSchema={parsedSchema.requestSchema}
                handleSave={onSubmit}
                schema={getCommandSchema(true)}
            />
        );
    };

    const getCommandSchema = (isRequest: boolean) => {
        const schema = isRequest ?
            commandModelDefinition.request :
            commandModelDefinition.response;
        if (!schema) {
            return '--';
        }
        else {
            return getSchemaType(schema.schema);
        }
    };

    const renderCommandName = () => {
        const ariaLabel = t(ResourceKeys.deviceCommands.columns.name);
        let displayName = getLocalizedData(commandModelDefinition.displayName);
        displayName = displayName ? displayName : '--';
        let description = getLocalizedData(commandModelDefinition.description);
        description = description ? description : '--';
        return <div className="col-sm3"><Label aria-label={ariaLabel}>{commandModelDefinition.name} ({displayName} / {description})</Label></div>;
    };

    const renderCommandSchema = (isRequest: boolean) => {
        const ariaLabel = t(ResourceKeys.deviceCommands.columns.type);
        return <div className="col-sm3"><Label aria-label={ariaLabel}>{getCommandSchema(isRequest)}</Label></div>;
    };

    const renderCommandType = () => {
        const ariaLabel = t(ResourceKeys.deviceCommands.columns.schema.request);
        return <div className="col-sm2"><Label aria-label={ariaLabel}>{commandModelDefinition.commandType ? commandModelDefinition.commandType : '--'}</Label></div>;
    };

    const renderCollapseButton = () => {
        return (
        <div className="col-sm1">
            <Button
                appearance="subtle"
                title={t(collapsed ? ResourceKeys.deviceCommands.command.expand : ResourceKeys.deviceCommands.command.collapse)}
                icon={collapsed ? <ChevronDownRegular /> : <ChevronUpRegular />}
            />
        </div>);
    };

    const onSubmit = (data: any) => () => { // tslint:disable-line:no-any
        const hasUndefinedFields = (requestData: any) => { // tslint:disable-line:no-any
            if (requestData === undefined) {
                return true;
            }

            for (const field in requestData) {
                if (data[field] === undefined) {
                    return true;
                }
            }
        };

        if (hasUndefinedFields(data)) {
            setShowConfirmationDialog(true);
            setConfirmationCmdData(data);
        } else {
            setAnnouncement(t(ResourceKeys.deviceCommands.command.submit));
            invokeCommand({
                connectTimeoutInSeconds: CONNECTION_TIMEOUT_IN_SECONDS,
                deviceId,
                methodName: componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ? commandModelDefinition.name : `${componentName}*${commandModelDefinition.name}`,
                moduleId,
                payload: data,
                responseSchema: parsedSchema.responseSchema,
                responseTimeoutInSeconds: RESPONSE_TIME_IN_SECONDS
            });
        }
    };

    const handleToggleCollapse = () => {
        handleCollapseToggle();
    };

    const onCancelSendCommand = () => {
        setShowConfirmationDialog(false);
    };

    const onConfirmSendCommand = () => {
        setShowConfirmationDialog(false);
        setAnnouncement(t(ResourceKeys.deviceCommands.command.submit));
        invokeCommand({
            connectTimeoutInSeconds: CONNECTION_TIMEOUT_IN_SECONDS,
            deviceId,
            methodName: componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ? commandModelDefinition.name : `${componentName}*${commandModelDefinition.name}`,
            moduleId,
            payload: confirmationCmdData,
            responseSchema: parsedSchema.responseSchema,
            responseTimeoutInSeconds: RESPONSE_TIME_IN_SECONDS
        });
    };

    return (
        <article className="list-item" role="listitem">
            <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                {createCollapsedSummary()}
                {createUncollapsedCard()}
            </ErrorBoundary>
            <SendCommandConfirmation
                hidden={!showConfirmationDialog}
                onSendCancel={onCancelSendCommand}
                onSendConfirm={onConfirmSendCommand}
            />
            <LiveRegion message={announcement} />
        </article>
    );
};
