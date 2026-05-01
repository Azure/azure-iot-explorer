/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabList, Tab, SelectTabData, SelectTabEvent } from '@fluentui/react-components';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { DeviceSettings } from '../deviceSettings/deviceSettings';
import { DeviceProperties } from '../deviceProperties/deviceProperties';
import { DeviceCommands } from '../deviceCommands/deviceCommands';
import { DeviceInterfaces } from '../deviceInterfaces/deviceInterfaces';
import { DeviceEvents } from '../../../deviceEvents/components/deviceEvents';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { DeviceEventsStateContextProvider } from '../../../deviceEvents/context/deviceEventsStateProvider';
import './digitalTwinDetail.scss';

export const DigitalTwinDetail: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const { getModelDefinition } = usePnpStateContext();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);
    const NAV_LINK_ITEMS_PNP = [ROUTE_PARTS.INTERFACES, ROUTE_PARTS.PROPERTIES, ROUTE_PARTS.SETTINGS, ROUTE_PARTS.COMMANDS, ROUTE_PARTS.EVENTS];

    React.useEffect(
        () => {
            getModelDefinition();
        },
        []);

    const [selectedKey, setSelectedKey] = React.useState((NAV_LINK_ITEMS_PNP.find(item => pathname.indexOf(item) > 0) || ROUTE_PARTS.INTERFACES).toString());
    const path = pathname.replace(/\/ioTPlugAndPlayDetail\/.*/, `/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`);
    const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        const key = data.value as string;
        setSelectedKey(key);
        let linkUrl = `${path}/${key}/?` +
            `${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` +
            `&${ROUTE_PARAMS.COMPONENT_NAME}=${componentName}` +
            `&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`;
        if (moduleId) {
            linkUrl += `&${ROUTE_PARAMS.MODULE_ID}=${moduleId}`;
        }
        navigate(linkUrl);
    };

    return (
        <div className="digitaltwin-pivot">
            <TabList
                aria-label={t(ResourceKeys.digitalTwin.pivot.ariaLabel)}
                selectedValue={selectedKey}
                onTabSelect={handleTabSelect}
            >
                <Tab key={ROUTE_PARTS.INTERFACES} value={ROUTE_PARTS.INTERFACES}>{t(ResourceKeys.breadcrumb.interfaces)}</Tab>
                <Tab key={ROUTE_PARTS.PROPERTIES} value={ROUTE_PARTS.PROPERTIES}>{t(ResourceKeys.breadcrumb.properties)}</Tab>
                <Tab key={ROUTE_PARTS.SETTINGS} value={ROUTE_PARTS.SETTINGS}>{t(ResourceKeys.breadcrumb.settings)}</Tab>
                <Tab key={ROUTE_PARTS.COMMANDS} value={ROUTE_PARTS.COMMANDS}>{t(ResourceKeys.breadcrumb.commands)}</Tab>
                <Tab key={ROUTE_PARTS.EVENTS} value={ROUTE_PARTS.EVENTS}>{t(ResourceKeys.breadcrumb.events)}</Tab>
            </TabList>
            {selectedKey === ROUTE_PARTS.INTERFACES && <DeviceInterfaces />}
            {selectedKey === ROUTE_PARTS.PROPERTIES && <DeviceProperties />}
            {selectedKey === ROUTE_PARTS.SETTINGS && <DeviceSettings />}
            {selectedKey === ROUTE_PARTS.COMMANDS && <DeviceCommands />}
            {selectedKey === ROUTE_PARTS.EVENTS && (
                <DeviceEventsStateContextProvider>
                    <DeviceEvents />
                </DeviceEventsStateContextProvider>
            )}
        </div>
    );
};
