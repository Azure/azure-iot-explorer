/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { Stack, Pivot, PivotItem } from '@fluentui/react';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { DeviceSettings } from '../deviceSettings/deviceSettings';
import { DeviceProperties } from '../deviceProperties/deviceProperties';
import { DeviceCommands } from '../deviceCommands/deviceCommands';
import { DeviceInterfaces } from '../deviceInterfaces/deviceInterfaces';
import { DeviceEvents } from '../../../deviceEvents/components/deviceEvents';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { usePnpStateContext } from '../../../../shared/contexts/pnpStateContext';
import './digitalTwinDetail.scss';
import { DeviceEventsStateContextProvider } from '../../../deviceEvents/context/deviceEventsStateProvider';

export const DigitalTwinDetail: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
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
    const handleLinkClick = (item: PivotItem) => {
        setSelectedKey(item.props.itemKey);
        let linkUrl = `${path}/${item.props.itemKey}/?` +
            `${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` +
            `&${ROUTE_PARAMS.COMPONENT_NAME}=${componentName}` +
            `&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`;
        if (moduleId) {
            linkUrl += `&${ROUTE_PARAMS.MODULE_ID}=${moduleId}`;
        }
        history.push(linkUrl);
    };

    return (
        <Pivot
            className="digitaltwin-pivot"
            aria-label={t(ResourceKeys.digitalTwin.pivot.ariaLabel)}
            selectedKey={selectedKey}
            onLinkClick={handleLinkClick}
            overflowBehavior="menu"
        >
            <PivotItem key={ROUTE_PARTS.INTERFACES} headerText={t(ResourceKeys.breadcrumb.interfaces)} itemKey={ROUTE_PARTS.INTERFACES}>
                <DeviceInterfaces />
            </PivotItem>
            <PivotItem key={ROUTE_PARTS.PROPERTIES} headerText={t(ResourceKeys.breadcrumb.properties)} itemKey={ROUTE_PARTS.PROPERTIES}>
                <DeviceProperties />
            </PivotItem>
            <PivotItem key={ROUTE_PARTS.SETTINGS} headerText={t(ResourceKeys.breadcrumb.settings)} itemKey={ROUTE_PARTS.SETTINGS}>
                <DeviceSettings />
            </PivotItem>
            <PivotItem key={ROUTE_PARTS.COMMANDS} headerText={t(ResourceKeys.breadcrumb.commands)} itemKey={ROUTE_PARTS.COMMANDS}>
                <DeviceCommands />
            </PivotItem>
            <PivotItem key={ROUTE_PARTS.EVENTS} headerText={t(ResourceKeys.breadcrumb.events)} itemKey={ROUTE_PARTS.EVENTS}>
                <DeviceEventsStateContextProvider>
                    <DeviceEvents />
                </DeviceEventsStateContextProvider>
            </PivotItem>
        </Pivot>
    );
};
