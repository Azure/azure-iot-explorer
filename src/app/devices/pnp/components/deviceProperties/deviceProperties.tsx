/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { DevicePropertiesPerInterface } from './devicePropertiesPerInterface';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { ROUTE_PARAMS } from '../../../../constants/routes';
import { usePnpStateContext } from '../../../../shared/contexts/pnpStateContext';
import { getDeviceTwinAction } from '../../actions';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { generateReportedTwinSchemaAndInterfaceTuple } from './dataHelper';

export const DeviceProperties: React.FC = () => {
    const { t } = useTranslation();
    const { pathname, search } = useLocation();
    const history = useHistory();
    const componentName = getComponentNameFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);

    const { pnpState, dispatch, getModelDefinition } = usePnpStateContext();
    const isLoading = pnpState.twin.synchronizationStatus === SynchronizationStatus.working ||
    pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working;
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const twin = pnpState.twin.payload;
    const twinAndSchema = React.useMemo(() => {
        return generateReportedTwinSchemaAndInterfaceTuple(modelDefinition, twin, componentName);
    },                                  [twin, modelDefinition]);

    const renderProperties = () => {
        return (
            <>
                {!twinAndSchema || twinAndSchema.length === 0 ?
                    <Label className="no-pnp-content">{t(ResourceKeys.deviceProperties.noProperties, {componentName})}</Label> :
                    <DevicePropertiesPerInterface twinAndSchema={twinAndSchema} />
                }
            </>
        );
    };

    const handleRefresh = () => {
        dispatch(getDeviceTwinAction.started(deviceId));
        getModelDefinition();
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/properties\/.*/, ``);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    if (isLoading) {
        return  <MultiLineShimmer/>;
    }

    return (
        <>
            <CommandBar
                    className="command"
                    items={[
                        {
                            ariaLabel: t(ResourceKeys.deviceProperties.command.refresh),
                            iconProps: {iconName: REFRESH},
                            key: REFRESH,
                            name: t(ResourceKeys.deviceProperties.command.refresh),
                            onClick: handleRefresh
                        }
                    ]}
                    farItems={[
                        {
                            ariaLabel: t(ResourceKeys.deviceProperties.command.close),
                            iconProps: {iconName: NAVIGATE_BACK},
                            key: NAVIGATE_BACK,
                            name: t(ResourceKeys.deviceProperties.command.close),
                            onClick: handleClose
                        }
                    ]}
            />
            {renderProperties()}
        </>
    );

};
