/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch, Route } from 'react-router-dom';
import { DeviceList } from '../../devices/deviceList/components/deviceList';
import { AddDevice } from '../../devices/addDevice/components/addDevice';
import { DeviceContent } from '../../devices/deviceIdentity/components/deviceContent';
import { BreadcrumbRoute } from '../../navigation/components/breadcrumbRoute';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';

export const IotHubDevices: React.FC = () => {
    const { t } = useTranslation();
    const { url }  = useRouteMatch();

    return (
       <>
            <Route path={`${url}`} component={(DeviceList)} exact={true}/>
            <BreadcrumbRoute
                breadcrumbProps={{ name: t(ResourceKeys.breadcrumb.add) }}
                routeProps={{path: `${url}/${ROUTE_PARTS.ADD}`, exact: true }}
            >
                    <AddDevice/>
            </BreadcrumbRoute>
            <Route path={`${url}/${ROUTE_PARTS.DEVICE_DETAIL}`} component={DeviceContent}/>
       </>
    );
};
