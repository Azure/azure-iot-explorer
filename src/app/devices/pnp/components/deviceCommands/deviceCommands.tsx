/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar, Label } from '@fluentui/react';
import { useLocation, useHistory } from 'react-router-dom';
import { DeviceCommandsPerInterface } from './deviceCommandsPerInterface';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getComponentNameFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { usePnpStateContext } from '../../../../shared/contexts/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { InvokeCommandActionParameters, invokeCommandAction } from '../../actions';
import { getDeviceCommandPairs } from './dataHelper';
import { getBackUrl } from '../../utils';
import { AppInsightsClient } from '../../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES, TELEMETRY_USER_ACTIONS } from '../../../../constants/telemetry';

export const DeviceCommands: React.FC = () => {
    const { search, pathname } = useLocation();
    const history = useHistory();
    const { t } = useTranslation();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);

    const { pnpState, dispatch, getModelDefinition } = usePnpStateContext();
    const isLoading = pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working;
    const modelDefinition = pnpState.modelDefinitionWithSource.payload && pnpState.modelDefinitionWithSource.payload.modelDefinition;
    const extendedModelDefinition = pnpState.modelDefinitionWithSource.payload && pnpState.modelDefinitionWithSource.payload.extendedModel;
    const commandSchemas = React.useMemo(() => getDeviceCommandPairs(extendedModelDefinition || modelDefinition).commandSchemas, [extendedModelDefinition, modelDefinition]);

    const invokeCommand = (parameters: InvokeCommandActionParameters) => {
        AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.PNP_SEND_COMMAND);
        dispatch(invokeCommandAction.started(parameters));
    };

    const renderCommandsPerInterface = () => {
        return (
            <>
                {!commandSchemas || commandSchemas.length === 0 ?
                    <Label className="no-pnp-content">{t(ResourceKeys.deviceCommands.noCommands, {componentName})}</Label> :
                    <DeviceCommandsPerInterface
                        invokeCommand={invokeCommand}
                        commandSchemas={commandSchemas}
                        componentName={componentName}
                        deviceId={deviceId}
                        moduleId={moduleId}
                    />
                }
            </>
        );
    };

    const handleRefresh = () => getModelDefinition();
    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/commands\/.*/, ``);
        history.push(getBackUrl(path, search));
    };

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.PNP_COMMANDS});
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
                        ariaLabel: t(ResourceKeys.deviceCommands.command.refresh),
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: t(ResourceKeys.deviceCommands.command.refresh),
                        onClick: handleRefresh
                    }
                ]}
                farItems={[
                    {
                        ariaLabel: t(ResourceKeys.deviceCommands.command.close),
                        iconProps: {iconName: NAVIGATE_BACK},
                        key: NAVIGATE_BACK,
                        name: t(ResourceKeys.deviceCommands.command.close),
                        onClick: handleClose
                    }
                ]}
            />
            {renderCommandsPerInterface()}
        </>
    );
};
