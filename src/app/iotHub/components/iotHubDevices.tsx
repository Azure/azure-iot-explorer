/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { DeviceList } from '../../devices/deviceList/components/deviceList';
import { AddDevice } from '../../devices/addDevice/components/addDevice';
import { DeviceContent } from '../../devices/deviceIdentity/components/deviceContent';
import { BreadcrumbRoute } from '../../navigation/components/breadcrumbRoute';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';

export const IotHubDevices: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Routes>
            <Route path="/" element={<DeviceList/>}/>
            <Route
                path={`${ROUTE_PARTS.ADD}`}
                element={
                    <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.add) }}>
                        <AddDevice/>
                    </BreadcrumbRoute>
                }
            />
            <Route path={`${ROUTE_PARTS.DEVICE_DETAIL}/*`} element={<DeviceContent/>}/>
        </Routes>
    );
};
