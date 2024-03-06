/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar, Label } from '@fluentui/react';
import { useLocation, useHistory } from 'react-router-dom';
import { DeviceSettingsPerInterface } from './deviceSettingsPerInterface';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { updateDeviceTwinAction, updateModuleTwinAction } from '../../actions';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { generateTwinSchemaAndInterfaceTuple } from './dataHelper';
import { Twin } from '../../../../api/models/device';
import { dispatchGetTwinAction, getBackUrl } from '../../utils';
import { AppInsightsClient } from '../../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES, TELEMETRY_USER_ACTIONS } from '../../../..//constants/telemetry';
import { useConnectionStringContext } from '../../../../connectionStrings/context/connectionStringContext';

// tslint:disable-next-line:cyclomatic-complexity
export const DeviceSettings: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    const { pnpState, dispatch, getModelDefinition } = usePnpStateContext();
    const [ {connectionString} ] = useConnectionStringContext();
    const isLoading = (pnpState.twin.synchronizationStatus === SynchronizationStatus.working)
        || (pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working);
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource && pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const extendedModelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.extendedModel;
    const twin = pnpState.twin.payload;
    const twinWithSchema = React.useMemo(() => {
        return generateTwinSchemaAndInterfaceTuple(extendedModelDefinition || modelDefinition, twin, componentName);
    },                                   [modelDefinition, twin, extendedModelDefinition]);

    const patchTwin = (parameters: Twin) => {
        AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.PNP_UPDATE_PROPERTY);
        if (moduleId) {
            dispatch(updateModuleTwinAction.started({connectionString, moduleTwin: {...parameters, moduleId}}));
        }
        else {
            dispatch(updateDeviceTwinAction.started({connectionString, twin: parameters}));
        }
    };

    const renderProperties = () => {
        return (
            <>
                {!twinWithSchema || twinWithSchema.length === 0 ?
                    <Label className="no-pnp-content">{t(ResourceKeys.deviceSettings.noSettings, {componentName})}</Label> :
                    <DeviceSettingsPerInterface
                        componentName={componentName}
                        patchTwin={patchTwin}
                        interfaceId={interfaceId}
                        twinWithSchema={twinWithSchema}
                        deviceId={deviceId}
                        moduleId={moduleId}
                    />
                }
            </>
        );
    };

    const onRefresh = () => {
        dispatchGetTwinAction(search, connectionString, dispatch);
        getModelDefinition();
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/settings\/.*/, ``);
        history.push(getBackUrl(path, search));
    };

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.PNP_DEVICE_SETTINGS});
    }, []); // tslint:disable-line: align

    if (isLoading) {
        return (
            <MultiLineShimmer/>
        );
    }

    return (
        <>
            <CommandBar
                    className="command"
                    items={[
                        {
                            ariaLabel: t(ResourceKeys.deviceSettings.command.refresh),
                            iconProps: {iconName: REFRESH},
                            key: REFRESH,
                            name: t(ResourceKeys.deviceSettings.command.refresh),
                            onClick: onRefresh
                        }
                    ]}
                    farItems={[
                        {
                            ariaLabel: t(ResourceKeys.deviceSettings.command.close),
                            iconProps: {iconName: NAVIGATE_BACK},
                            key: NAVIGATE_BACK,
                            name: t(ResourceKeys.deviceSettings.command.close),
                            onClick: handleClose
                        }
                    ]}
            />
            {renderProperties()}
        </>
    );
};
