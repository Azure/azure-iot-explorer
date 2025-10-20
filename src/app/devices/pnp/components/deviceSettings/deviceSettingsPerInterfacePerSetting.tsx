/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
import { ComplexReportedFormPanel } from '../../../shared/components/complexReportedFormPanel';
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { DataForm } from '../../../shared/components/dataForm';
import { TwinWithSchema } from './dataHelper';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';
import { getSchemaType } from '../../../../shared/utils/jsonSchemaAdaptor';
import { Twin } from '../../../../api/models/device';
import { ModuleTwin } from '../../../../api/models/moduleTwin';

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
                {renderCollapseButton()}
            </header>
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
            <div role="dialog" aria-label={t(ResourceKeys.deviceSettings.command.openReportedValuePanel)}>
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
        <li className="list-item">
            <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                {createCollapsedSummary()}
                {createUncollapsedCard()}
                {createReportedValuePanel()}
            </ErrorBoundary>
        </li>
    );
};
