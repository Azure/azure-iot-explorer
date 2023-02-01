/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Stack, ActionButton, IconButton } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
import { ComplexReportedFormPanel } from '../../../shared/components/complexReportedFormPanel';
import { RenderSimplyTypeValue } from '../../../shared/components/simpleReportedSection';
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { SemanticUnit } from '../../../../shared/units/components/semanticUnit';
import { DataForm } from '../../../shared/components/dataForm';
import { TwinWithSchema } from './dataHelper';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';
import { getSchemaType, isSchemaSimpleType } from '../../../../shared/utils/jsonSchemaAdaptor';
import { Twin } from '../../../../api/models/device';
import { ModuleTwin } from '../../../../api/models/moduleTwin';
import { EnumSchema } from '../../../../api/models/modelDefinition';

export interface DeviceSettingDataProps extends TwinWithSchema {
    collapsed: boolean;
    deviceId: string;
    moduleId: string;
    interfaceId: string;
    componentName: string;
}

export interface DeviceSettingDispatchProps {
    handleCollapseToggle: () => void;
    handleOverlayToggle: () => void;
    patchTwin: (parameters: Partial<Twin>) => void;
}

export const DeviceSettingsPerInterfacePerSetting: React.FC<DeviceSettingDataProps & DeviceSettingDispatchProps> = (props: DeviceSettingDataProps & DeviceSettingDispatchProps) => {
    const { t } = useTranslation();

    const { settingSchema, settingModelDefinition, collapsed, reportedSection, handleOverlayToggle } = props;
    const [ showReportedValuePanel, setShowReportedValuePanel ] = React.useState<boolean>(false);

    const createCollapsedSummary = () => {
        return (
            <header className={`flex-grid-row item-summary ${collapsed ? '' : 'item-summary-uncollapsed'}`} onClick={props.handleCollapseToggle}>
                {renderPropertyName()}
                {renderPropertySchema()}
                {renderPropertyUnit()}
                {renderReportedValueAndMetadata()}
                {renderCollapseButton()}
            </header>
        );
    };

    const renderPropertyName = () => {
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.name);
        let displayName = getLocalizedData(settingModelDefinition.displayName);
        displayName = displayName ? displayName : '--';
        let description = getLocalizedData(settingModelDefinition.description);
        description = description ? description : '--';
        return <div className="col-sm3"><Label aria-label={ariaLabel}>{settingModelDefinition.name} ({displayName} / {description})</Label></div>;
    };

    const renderPropertySchema = () => {
        const ariaLabel = t(ResourceKeys.deviceProperties.columns.schema);
        const schemaType = getSchemaType(settingModelDefinition.schema);
        return <div className="col-sm2"><Label aria-label={ariaLabel}>{schemaType}</Label></div>;
    };

    const renderPropertyUnit = () => {
        return (
            <div className="col-sm2">
                <Label aria-label={t(ResourceKeys.deviceProperties.columns.unit)}>
                    <SemanticUnit unitHost={settingModelDefinition} />
                </Label>
            </div>);
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const renderReportedValueAndMetadata = () => {
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.reportedValue);
        return (
            <div className="column-value-text col-sm4" aria-label={ariaLabel}>
                <Stack>
                    <Stack.Item align="start" style={{maxWidth: '40%', minWidth: 20}}>
                        {renderReportedValue()}
                    </Stack.Item>
                    <Stack.Item align="start">
                        {t(ResourceKeys.deviceSettings.ackStatus.code, {code: reportedSection?.ac || '--'})}
                    </Stack.Item>
                    <Stack.Item align="start">
                        {t(ResourceKeys.deviceSettings.ackStatus.description, {description: reportedSection?.ad || '--'})}
                    </Stack.Item>
                    <Stack.Item align="start">
                        {t(ResourceKeys.deviceSettings.ackStatus.version, {version: reportedSection?.av || '--'})}
                    </Stack.Item>
                </Stack>
            </div>
        );
    };

    // tslint:disable-next-line:cyclomatic-complexity
    const renderReportedValue = () => {
        const reportedValue = reportedSection?.value !== undefined ? reportedSection.value : reportedSection;
        let displayValue = (settingModelDefinition?.schema as EnumSchema)?.enumValues?.find(item => item.enumValue === reportedValue)?.displayName || reportedValue;
        // tslint:disable-next-line:no-any
        displayValue = (displayValue as any)?.en || displayValue;
        return (
            <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                {
                    settingSchema && isSchemaSimpleType(settingModelDefinition.schema, settingSchema.$ref) ?
                        RenderSimplyTypeValue(
                            reportedValue,
                            settingSchema,
                            displayValue,
                            t(ResourceKeys.deviceSettings.columns.error)) :
                        reportedValue ?
                            <ActionButton
                                className="column-value-button"
                                ariaDescription={t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                                onClick={onViewReportedValue}
                            >
                                {t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                            </ActionButton> : <Label>--</Label>
                }
            </ErrorBoundary>
        );
    };

    const renderCollapseButton = () => {
        return (
        <div className="col-sm1">
            <IconButton
                title={t(collapsed ? ResourceKeys.deviceSettings.command.expand : ResourceKeys.deviceSettings.command.collapse)}
                iconProps={{iconName: collapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
            />
        </div>);
    };

    const createUncollapsedCard = () => {
        return (
            <section className={collapsed ? 'item-detail' : 'item-detail item-detail-uncollapsed'}>
                {!collapsed && createForm()}
            </section>
        );
    };

    const createReportedValuePanel = () => {
        return (
            <div role="dialog">
                {showReportedValuePanel &&
                    <ComplexReportedFormPanel
                        schema={settingSchema}
                        modelDefinition={settingModelDefinition}
                        showPanel={showReportedValuePanel}
                        formData={reportedSection?.value}
                        handleDismiss={handleDismissViewReportedPanel}
                    />}
            </div>
        );
    };

    const onViewReportedValue = (event: React.MouseEvent<HTMLElement>) => {
        setShowReportedValuePanel(true);
        handleOverlayToggle();
        if (event) {
            event.stopPropagation();
        }
    };

    const handleDismissViewReportedPanel = () => {
        setShowReportedValuePanel(false);
        handleOverlayToggle();
    };

    const createForm = () => {
        const { desiredValue } = props;
        return (
            <DataForm
                buttonText={ResourceKeys.deviceSettings.command.submit}
                formData={desiredValue !== undefined ? desiredValue : reportedSection?.value}
                settingSchema={settingSchema}
                handleSave={onSubmit}
                schema={getSchemaType(settingModelDefinition.schema)}
            />
        );
    };

    const createSettingsPayload = (twin: boolean | number | string | object): Partial<Twin | ModuleTwin> => {
        const { componentName, deviceId, moduleId } = props;
        const desired = {} as any; // tslint:disable-line: no-any
        if (componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN) {
            desired[settingModelDefinition.name] = twin;
        }
        else {
            const componentValue = {__t: 'c'} as any; // tslint:disable-line: no-any
            componentValue[settingModelDefinition.name] = twin;
            desired[componentName] = componentValue;
        }

        return {
            deviceId,
            moduleId,
            properties: {
                desired
            }
        };
    };

    const onSubmit = (twin: boolean | number | string | object) => () => {
        props.patchTwin(createSettingsPayload(twin));
    };

    return (
        <article className="list-item" role="listitem">
            <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                {createCollapsedSummary()}
                {createUncollapsedCard()}
                {createReportedValuePanel()}
            </ErrorBoundary>
        </article>
    );
};
