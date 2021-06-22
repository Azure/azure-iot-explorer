/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { Stack, Pivot, PivotItem } from '@fluentui/react';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceSettings } from './deviceSettings/deviceSettings';
import { DeviceProperties } from './deviceProperties/deviceProperties';
import { DeviceCommands } from './deviceCommands/deviceCommands';
import { DeviceInterfaces } from './deviceInterfaces/deviceInterfaces';
import { DeviceEvents } from '../../deviceEvents/components/deviceEvents';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString, getModuleIdentityIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { usePnpStateContext } from '../../../shared/contexts/pnpStateContext';
import './digitalTwinDetail.scss';

export const DigitalTwinDetail: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const { url } = useRouteMatch();
    const { getModelDefinition } = usePnpStateContext();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);
    const NAV_LINK_ITEMS_PNP = [ROUTE_PARTS.INTERFACES, ROUTE_PARTS.PROPERTIES, ROUTE_PARTS.SETTINGS, ROUTE_PARTS.COMMANDS, ROUTE_PARTS.EVENTS];

    React.useEffect(() => {
        getModelDefinition();
    },              []);

    const [selectedKey, setSelectedKey] = React.useState((NAV_LINK_ITEMS_PNP.find(item => pathname.indexOf(item) > 0) || ROUTE_PARTS.INTERFACES).toString());
    const path = pathname.replace(/\/ioTPlugAndPlayDetail\/.*/, `/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`);
    const pivotItems = NAV_LINK_ITEMS_PNP.map(nav =>  {
        const text = t((ResourceKeys.breadcrumb as any)[nav]); // tslint:disable-line:no-any
        return (<PivotItem key={nav} headerText={text} itemKey={nav} />);
    });
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
    const pivot = (
        <Pivot
            aria-label={t(ResourceKeys.digitalTwin.pivot.ariaLabel)}
            selectedKey={selectedKey}
            onLinkClick={handleLinkClick}
//            overflowBehavior="menu" // needs updated Fluent
        >
            {pivotItems}
        </Pivot>
    );

    return (
        <>
            <Stack horizontal={true} className="digitaltwin-pivot">
                {pivot}
            </Stack>
            <Route path={`${url}/${ROUTE_PARTS.SETTINGS}/`} component={DeviceSettings}/>
            <Route path={`${url}/${ROUTE_PARTS.PROPERTIES}/`} component={DeviceProperties}/>
            <Route path={`${url}/${ROUTE_PARTS.COMMANDS}/`} component={DeviceCommands}/>
            <Route path={`${url}/${ROUTE_PARTS.INTERFACES}/`} component={DeviceInterfaces}/>
            <Route path={`${url}/${ROUTE_PARTS.EVENTS}/`} component={DeviceEvents}/>
        </>
    );
};
