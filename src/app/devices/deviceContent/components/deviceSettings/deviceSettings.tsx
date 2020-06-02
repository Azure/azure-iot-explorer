/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { DeviceSettingsPerInterface } from './deviceSettingsPerInterface';
import { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { PatchDigitalTwinActionParameters } from '../../actions';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { DigitalTwinHeaderView } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';

export interface DeviceSettingsProps extends DeviceInterfaceWithSchema{
    isLoading: boolean;
}

export interface DeviceInterfaceWithSchema {
    interfaceId: string;
    componentName: string;
    twinWithSchema: TwinWithSchema[];
}

export interface DeviceSettingDispatchProps {
    refresh: (deviceId: string, interfaceId: string) => void;
    setComponentName: (id: string) => void;
    patchDigitalTwin: (parameters: PatchDigitalTwinActionParameters) => void;
}

export const DeviceSettings: React.FC<DeviceSettingsProps & DeviceSettingDispatchProps> = (props: DeviceSettingsProps & DeviceSettingDispatchProps) => {
    const { t } = useLocalizationContext();
    const { search, pathname } = useLocation();
    const history = useHistory();

    const { setComponentName, refresh, patchDigitalTwin, twinWithSchema, isLoading } = props;
    const deviceId = getDeviceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    React.useEffect(() => {
        setComponentName(componentName);
    },              []);

    const renderProperties = () => {
        return (
            <>
                <Route component={DigitalTwinHeaderView} />
                {!twinWithSchema || twinWithSchema.length === 0 ?
                    <Label className="no-pnp-content">{t(ResourceKeys.deviceSettings.noSettings, {componentName})}</Label> :
                    <DeviceSettingsPerInterface
                        {...props}
                        deviceId={deviceId}
                    />
                }
            </>
        );
    };

    const handleRefresh = () => {
        refresh(deviceId, interfaceId);
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
                            onClick: handleRefresh
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
