/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { ActionButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import { ComplexReportedFormPanel } from '../shared/complexReportedFormPanel';
import { RenderSimplyTypeValue } from '../shared/simpleReportedSection';
import { PatchDigitalTwinActionParameters } from '../../actions';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { SemanticUnit } from '../../../../shared/units/components/semanticUnit';
import { JsonPatchOperation, PatchPayload } from '../../../../api/parameters/deviceParameters';
import { MetadataSection } from './selectors';
import { isValueDefined, DataForm } from './../shared/dataForm';
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

export const DeviceSettingsPerInterfacePerSetting: React.FC<DeviceSettingDataProps & DeviceSettingDispatchProps> = (props: DeviceSettingDataProps & DeviceSettingDispatchProps) => {
    const { t } = useLocalizationContext();

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

    const renderReportedValueAndMetadata = () => {
        const ariaLabel = t(ResourceKeys.deviceSettings.columns.reportedValue);
        return (
            <div className="column-value-text col-sm4" aria-label={ariaLabel}>
                <Stack horizontal={true}>
                    <Stack.Item align="start" className="reported-property">
                        {renderReportedValue()}
                    </Stack.Item>
                    {metadata &&
                        <Stack.Item align="start" className={`${isSchemaSimpleType() ? 'reported-status' : 'reported-status-complex'} `}>
                            {metadata.ackCode && `(${metadata.ackCode} ${metadata.ackDescription})`}
                        </Stack.Item>
                    }
                </Stack>
            </div>
        );
    };

    const renderReportedValue = () => {
        const { reportedTwin } = props;
        return (
            <>
                {isValueDefined(reportedTwin) ?
                    (isSchemaSimpleType() ?
                        RenderSimplyTypeValue(
                            reportedTwin,
                            settingSchema,
                            t(ResourceKeys.deviceSettings.columns.error)) :
                        <ActionButton
                            className="column-value-button"
                            ariaDescription={t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                            onClick={onViewReportedValue}
                        >
                            {t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}
                        </ActionButton>
                    ) : <Label>--</Label>
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

    const onViewReportedValue = () => {
        setShowReportedValuePanel(true);
        handleOverlayToggle();
        handleCollapseToggle();
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
                componentName={componentName}
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
            const patchPayloadWithTwin = isValueDefined(twin) ? {
                op: metadata && metadata.desiredValue ?
                    JsonPatchOperation.REPLACE : JsonPatchOperation.ADD,
                path: `/${componentName}/${settingModelDefinition.name}`,
                value: twin,
            } : {
                op: JsonPatchOperation.REMOVE,
                path: `/${componentName}/${settingModelDefinition.name}`,
            };
            return  [patchPayloadWithTwin];
        }
    };

    const onSubmit = (twin: boolean | number | string | object) => () => {
        patchDigitalTwin({
            digitalTwinId: deviceId,
            payload: createSettingsPayload(twin)
        });
    };

    return (
        <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
            {createCollapsedSummary()}
            {createUncollapsedCard()}
            {createReportedValuePanel()}
        </ErrorBoundary>
    );
};
