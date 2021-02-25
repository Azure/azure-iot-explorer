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
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { BreadcrumbWrapper } from '../../navigation/components/breadcrumbWrapper';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';

export const IotHubDevices: React.FC = () => {
    const { url }  = useRouteMatch();
    const { t } = useTranslation();
    useBreadcrumbEntry({ name: t(ResourceKeys.breadcrumb.devices), link: true });

    return (
       <>
            <Route path={`${url}`} component={(DeviceList)} exact={true}/>
            <Route path={`${url}/${ROUTE_PARTS.ADD}`} exact={true}>
                <BreadcrumbWrapper name={t(ResourceKeys.breadcrumb.add)}>
                    <AddDevice/>
                </BreadcrumbWrapper>
            </Route>
            <Route path={`${url}/${ROUTE_PARTS.DEVICE_DETAIL}`} component={DeviceContent}/>
       </>
    );
};
