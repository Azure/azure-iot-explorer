/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { DeviceCommandsPerInterface } from './deviceCommandsPerInterface';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InvokeDigitalTwinInterfaceCommandActionParameters } from '../../actions';
import { getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CommandSchema } from './deviceCommandsPerInterfacePerCommand';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { DigitalTwinHeaderView } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';

export interface DeviceCommandsProps extends DeviceInterfaceWithSchema{
    isLoading: boolean;
}

export interface DeviceInterfaceWithSchema {
    commandSchemas: CommandSchema[];
}

export interface DeviceCommandDispatchProps {
    refresh: (deviceId: string, interfaceId: string) => void;
    invokeDigitalTwinInterfaceCommand: (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => void;
    setComponentName: (id: string) => void;
}

export const DeviceCommands: React.FC<DeviceCommandsProps & DeviceCommandDispatchProps> = (props: DeviceCommandsProps & DeviceCommandDispatchProps) => {
    const { refresh, setComponentName, isLoading, commandSchemas } = props;
    const { search, pathname } = useLocation();
    const history = useHistory();
    const { t } = useLocalizationContext();
    const deviceId = getDeviceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);

    React.useEffect(() => {
        setComponentName(componentName);
    },              []);

    const renderCommandsPerInterface = () => {
        return (
            <>
                <Route component={DigitalTwinHeaderView} />
                {!commandSchemas || commandSchemas.length === 0 ?
                    <Label className="no-pnp-content">{t(ResourceKeys.deviceCommands.noCommands, {componentName})}</Label> :
                    <DeviceCommandsPerInterface
                        {...props}
                        componentName={getComponentNameFromQueryString(search)}
                        deviceId={getDeviceIdFromQueryString(search)}
                    />
                }
            </>
        );
    };

    const handleRefresh = () => {
        refresh(deviceId, componentName);
    };

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
