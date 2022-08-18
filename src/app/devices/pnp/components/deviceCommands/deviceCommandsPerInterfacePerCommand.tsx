/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, IconButton, PrimaryButton, Dialog } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard, SUBMIT } from '../../../../constants/iconNames';
import { ParsedCommandSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { CommandContent } from '../../../../api/models/modelDefinition';
import { DataForm } from '../../../shared/components/dataForm';
import { InvokeCommandActionParameters } from '../../actions';
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { getSchemaType } from '../../../../shared/utils/jsonSchemaAdaptor';
import { CONNECTION_TIMEOUT_IN_SECONDS, DEFAULT_COMPONENT_FOR_DIGITAL_TWIN, RESPONSE_TIME_IN_SECONDS } from '../../../../constants/devices';
import { ConfirmSend } from './confirmSend';

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
    const [ confirmingSend, setConfirmingSend ] = React.useState<boolean>(false);
    const [ confirmingSendData, setConfirmingSendData ] = React.useState({});

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
                            <PrimaryButton
                                className="submit-button"
                                onClick={onSubmit(null)}
                                text={t(ResourceKeys.deviceCommands.command.submit)}
                                iconProps={{ iconName: SUBMIT }}
                            />
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
            <IconButton
                title={t(collapsed ? ResourceKeys.deviceCommands.command.expand : ResourceKeys.deviceCommands.command.collapse)}
                iconProps={{iconName: collapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
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
            setConfirmingSend(true);
            setConfirmingSendData(data);
        } else {
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

    const onSendCancel = () => {
        setConfirmingSend(false);
    };

    const onSendConfirm = () => {
        setConfirmingSend(false);
        invokeCommand({
            connectTimeoutInSeconds: CONNECTION_TIMEOUT_IN_SECONDS,
            deviceId,
            methodName: componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ? commandModelDefinition.name : `${componentName}*${commandModelDefinition.name}`,
            moduleId,
            payload: confirmingSendData,
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
            <ConfirmSend
                hidden={!confirmingSend}
                onSendCancel={onSendCancel}
                onSendConfirm={onSendConfirm}
            />
        </article>
    );
};
