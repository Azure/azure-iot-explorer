/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { Stack } from 'office-ui-fabric-react/lib/components/Stack';
import { ActionButton, IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
import { ComplexReportedFormPanel } from '../../../shared/components/complexReportedFormPanel';
import { RenderSimplyTypeValue } from '../../../shared/components/simpleReportedSection';
import { PatchDigitalTwinActionParameters } from '../../actions';
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { SemanticUnit } from '../../../../shared/units/components/semanticUnit';
import { JsonPatchOperation, PatchPayload } from '../../../../api/parameters/deviceParameters';
import { isValueDefined, DataForm } from '../../../shared/components/dataForm';
import { TwinWithSchema } from './dataHelper';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';
import '../../../../css/_deviceSettings.scss';

export interface MetadataSection {
    desiredValue?: boolean | string | number | object;
    desiredVersion?: number;
    ackVersion?: number;
    ackCode?: number;
    ackDescription?: string;
    lastUpdatedTime?: string;
}

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

export const DeviceSettingsPerInterfacePerSetting: React.FC<DeviceSettingDataProps & DeviceSettingDispatchProps> = (props: DeviceSettingDataProps & DeviceSettingDispatchProps) => {
    const { t } = useTranslation();

    const { deviceId, settingSchema, settingModelDefinition, isComponentContainedInDigitalTwin, collapsed, metadata, componentName, patchDigitalTwin, handleCollapseToggle, handleOverlayToggle } = props;
    const [ showReportedValuePanel, setShowReportedValuePanel ] = React.useState<boolean>(false);

    const isSchemaSimpleType = () => {
        return settingSchema && (
            typeof settingModelDefinition.schema === 'string' ||
            settingModelDefinition.schema['@type'].toLowerCase() === 'enum');
    };

    const createCollapsedSummary = () => {
        return (
            <header className={`flex-grid-row item-summary ${collapsed ? '' : 'item-summary-uncollapsed'}`} onClick={handleCollapseToggle}>
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
        const schemaType = typeof settingModelDefinition.schema === 'string' ?
            settingModelDefinition.schema :
            settingModelDefinition.schema['@type'];
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
                    <Stack.Item align="start" className="reported-property">
                        {renderReportedValue()}
                    </Stack.Item>
                    <Stack.Item align="start">
                        {t(ResourceKeys.deviceSettings.ackStatus.code, {code: metadata && metadata.ackCode || '--'})}
                    </Stack.Item>
                    <Stack.Item align="start">
                        {t(ResourceKeys.deviceSettings.ackStatus.description, {description: metadata && metadata.ackDescription || '--'})}
                    </Stack.Item>
                    <Stack.Item align="start">
                        {t(ResourceKeys.deviceSettings.ackStatus.version, {version: metadata && metadata.ackVersion || '--'})}
                    </Stack.Item>
                </Stack>
            </div>
        );
    };

    const renderReportedValue = () => {
        const { reportedTwin } = props;
        return (
            <>
                {
                    isSchemaSimpleType() ?
                        <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                            {RenderSimplyTypeValue(
                                reportedTwin,
                                settingSchema,
                                t(ResourceKeys.deviceSettings.columns.error))}
                        </ErrorBoundary> :
                        reportedTwin ?
                        <ActionButton
                            className="column-value-button"
                            ariaDescription={t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                            onClick={onViewReportedValue}
                        >
                            {t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                        </ActionButton> : <Label>--</Label>
                }
            </>
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

    const getSettingSchema = () => {
        return typeof settingModelDefinition.schema === 'string' ?
            settingModelDefinition.schema :
            settingModelDefinition.schema['@type'];
    };

    const createReportedValuePanel = () => {
        const { reportedTwin, settingModelDefinition : modelDefinition, settingSchema : schema } = props;
        return (
            <div role="dialog">
                {showReportedValuePanel &&
                    <ComplexReportedFormPanel
                        schema={schema}
                        modelDefinition={modelDefinition}
                        showPanel={showReportedValuePanel}
                        formData={reportedTwin}
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
        return (
            <DataForm
                buttonText={ResourceKeys.deviceSettings.command.submit}
                formData={metadata && metadata.desiredValue}
                settingSchema={settingSchema}
                handleSave={onSubmit}
                craftPayload={createSettingsPayload}
                schema={getSettingSchema()}
            />
        );
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const createSettingsPayload = (twin: boolean | number | string | object): PatchPayload[] => {
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
            const path = componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ?
                `/${settingModelDefinition.name}` : `/${componentName}/${settingModelDefinition.name}`;
            const patchPayloadWithTwin = isValueDefined(twin) ? {
                op: JsonPatchOperation.ADD,
                path,
                value: twin,
            } : {
                op: JsonPatchOperation.REMOVE,
                path,
            };
            return [patchPayloadWithTwin];
        }
    };

    const onSubmit = (twin: boolean | number | string | object) => () => {
        patchDigitalTwin({
            digitalTwinId: deviceId,
            payload: createSettingsPayload(twin)
        });
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
