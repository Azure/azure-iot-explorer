/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { useLocation, useHistory } from 'react-router-dom';
import { DeviceSettingsPerInterface } from './deviceSettingsPerInterface';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { getDigitalTwinAction, PatchDigitalTwinActionParameters, patchDigitalTwinAction } from '../../actions';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { ROUTE_PARAMS } from '../../../../constants/routes';
import { usePnpStateContext } from '../../pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { generateTwinSchemaAndInterfaceTuple } from './dataHelper';

export const DeviceSettings: React.FC = () => {
    const { t } = useLocalizationContext();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const deviceId = getDeviceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    const { pnpState, dispatch, getModelDefinition } = usePnpStateContext();
    const isLoading = (pnpState.digitalTwin.synchronizationStatus === SynchronizationStatus.working)
     || (pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working);
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource && pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const digitalTwin = pnpState.digitalTwin.payload;
    const twinWithSchema = React.useMemo(() => {
        return generateTwinSchemaAndInterfaceTuple(modelDefinition, digitalTwin, componentName).twinWithSchema;
    },                                   [modelDefinition, digitalTwin]);

    const patchDigitalTwin = (parameters: PatchDigitalTwinActionParameters) => dispatch(patchDigitalTwinAction.started(parameters));

    const renderProperties = () => {
        return (
            <>
                {!twinWithSchema || twinWithSchema.length === 0 ?
                    <Label className="no-pnp-content">{t(ResourceKeys.deviceSettings.noSettings, {componentName})}</Label> :
                    <DeviceSettingsPerInterface
                        componentName={componentName}
                        patchDigitalTwin={patchDigitalTwin}
                        interfaceId={interfaceId}
                        twinWithSchema={twinWithSchema}
                        deviceId={deviceId}
                    />
                }
            </>
        );
    };

    const onRefresh = () => {
        dispatch(getDigitalTwinAction.started(deviceId));
        getModelDefinition();
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/settings\/.*/, ``);
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
