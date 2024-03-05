/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { CommandBar, Label } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { DevicePropertiesPerInterface } from './devicePropertiesPerInterface';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { generateReportedTwinSchemaAndInterfaceTuple } from './dataHelper';
import { dispatchGetTwinAction, getBackUrl } from '../../utils';
import { AppInsightsClient } from '../../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../../../constants/telemetry';
import { useConnectionStringContext } from '../../../../connectionStrings/context/connectionStringContext';

export const DeviceProperties: React.FC = () => {
    const { t } = useTranslation();
    const { pathname, search } = useLocation();
    const history = useHistory();
    const componentName = getComponentNameFromQueryString(search);

    const { pnpState, dispatch, getModelDefinition } = usePnpStateContext();
    const [ {connectionString} ] = useConnectionStringContext();
    const isLoading = pnpState.twin.synchronizationStatus === SynchronizationStatus.working ||
    pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working;
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const extendedModelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.extendedModel;
    const twin = pnpState.twin.payload;
    const twinAndSchema = React.useMemo(() => {
        return generateReportedTwinSchemaAndInterfaceTuple(extendedModelDefinition || modelDefinition, twin, componentName);
    },                                  [twin, modelDefinition, extendedModelDefinition]);

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
        dispatchGetTwinAction(search, connectionString, dispatch);
        getModelDefinition();
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/properties\/.*/, ``);
        history.push(getBackUrl(path, search));
    };

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.PNP_PROPERTIES});
    }, []); // tslint:disable-line: align

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
