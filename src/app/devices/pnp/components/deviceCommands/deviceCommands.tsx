/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { useLocation, useHistory } from 'react-router-dom';
import { DeviceCommandsPerInterface } from './deviceCommandsPerInterface';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { ROUTE_PARAMS } from '../../../../constants/routes';
import { usePnpStateContext } from '../../../../shared/contexts/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { InvokeDigitalTwinInterfaceCommandActionParameters, invokeDigitalTwinInterfaceCommandAction } from '../../actions';
import { getDeviceCommandPairs } from './dataHelper';

export const DeviceCommands: React.FC = () => {
    // const { refresh, setComponentName, isLoading, commandSchemas } = props;
    const { search, pathname } = useLocation();
    const history = useHistory();
    const { t } = useLocalizationContext();
    const deviceId = getDeviceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);

    const { pnpState, dispatch, getModelDefinition } = usePnpStateContext();
    const isLoading = pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working;
    const modelDefinition = pnpState.modelDefinitionWithSource.payload && pnpState.modelDefinitionWithSource.payload.modelDefinition;
    const commandSchemas = React.useMemo(() => getDeviceCommandPairs(modelDefinition).commandSchemas, [modelDefinition]);

    const invokeDigitalTwinInterfaceCommand = (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => dispatch(invokeDigitalTwinInterfaceCommandAction.started(parameters));

    const renderCommandsPerInterface = () => {
        return (
            <>
                {!commandSchemas || commandSchemas.length === 0 ?
                    <Label className="no-pnp-content">{t(ResourceKeys.deviceCommands.noCommands, {componentName})}</Label> :
                    <DeviceCommandsPerInterface
                        invokeDigitalTwinInterfaceCommand={invokeDigitalTwinInterfaceCommand}
                        commandSchemas={commandSchemas}
                        componentName={componentName}
                        deviceId={deviceId}
                    />
                }
            </>
        );
    };

    const handleRefresh = () => getModelDefinition();
    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/commands\/.*/, ``);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

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
