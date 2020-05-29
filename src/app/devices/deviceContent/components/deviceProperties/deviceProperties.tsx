/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { DevicePropertiesPerInterface, TwinWithSchema } from './devicePropertiesPerInterface';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { DigitalTwinHeaderView } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';

export interface DevicePropertiesDataProps {
    twinAndSchema: TwinWithSchema[];
    isLoading: boolean;
}

export interface DevicePropertiesDispatchProps {
    setComponentName: (id: string) => void;
    refresh: (deviceId: string, interfaceId: string) => void;
}

export const DeviceProperties: React.FC<DevicePropertiesDataProps & DevicePropertiesDispatchProps> = (props: DevicePropertiesDataProps & DevicePropertiesDispatchProps) => {
    const { t } = useLocalizationContext();
    const { pathname, search } = useLocation();
    const history = useHistory();

    const { refresh, setComponentName, isLoading, twinAndSchema } = props;
    const componentName = getComponentNameFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    React.useEffect(() => {
        setComponentName(componentName);
    },              []);

    const renderProperties = () => {
        return (
            <>
                <Route component={DigitalTwinHeaderView} />
                {!twinAndSchema || twinAndSchema.length === 0 ?
                    <Label className="no-pnp-content">{t(ResourceKeys.deviceProperties.noProperties, {componentName})}</Label> :
                    <DevicePropertiesPerInterface twinAndSchema={twinAndSchema} />
                }
            </>
        );
    };

    const handleRefresh = () => {
        refresh(deviceId, interfaceId);
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
