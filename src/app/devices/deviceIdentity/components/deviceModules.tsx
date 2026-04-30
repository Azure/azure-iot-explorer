/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ModuleIdentityTwin } from '../../module/moduleIdentityTwin/components/moduleIdentityTwin';
import { AddModuleIdentity } from '../../module/addModuleIdentity/components/addModuleIdentity';
import { ModuleIdentityList } from '../../module/moduleIdentityList/components/moduleIdentityList';
import { ModuleIdentityDetail } from '../../module/moduleIndentityDetail/components/moduleIdentityDetail';
import { ModuleDirectMethod } from '../../module/moduleDirectMethod/components/moduleDirectMethod';
import { BreadcrumbRoute } from '../../../navigation/components/breadcrumbRoute';
import { ROUTE_PARTS } from '../../../constants/routes';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getModuleIdentityIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { Pnp } from '../../pnp/components/pnp';
import { DeviceEvents } from '../../deviceEvents/components/deviceEvents';
import { DeviceEventsStateContextProvider } from '../../deviceEvents/context/deviceEventsStateProvider';

export const DeviceModules: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const moduleId = getModuleIdentityIdFromQueryString(search);

    return (
        <Routes>
            <Route path="/" element={<ModuleIdentityList/>}/>
            <Route
                path={`${ROUTE_PARTS.ADD}`}
                element={
                    <BreadcrumbRoute breadcrumb={{name: t(ResourceKeys.breadcrumb.addModuleIdentity)}}>
                        <AddModuleIdentity/>
                    </BreadcrumbRoute>
                }
            />
            <Route
                path={`${ROUTE_PARTS.MODULE_DETAIL}`}
                element={
                    <BreadcrumbRoute breadcrumb={{name: moduleId, suffix: search}}>
                        <ModuleIdentityDetail/>
                    </BreadcrumbRoute>
                }
            />
            <Route
                path={`${ROUTE_PARTS.MODULE_TWIN}`}
                element={
                    <BreadcrumbRoute breadcrumb={{name: moduleId, suffix: search}}>
                        <ModuleIdentityTwin/>
                    </BreadcrumbRoute>
                }
            />
            <Route
                path={`${ROUTE_PARTS.MODULE_METHOD}`}
                element={
                    <BreadcrumbRoute breadcrumb={{name: moduleId, suffix: search}}>
                        <ModuleDirectMethod/>
                    </BreadcrumbRoute>
                }
            />
            <Route
                path={`${ROUTE_PARTS.MODULE_EVENTS}/*`}
                element={
                    <DeviceEventsStateContextProvider>
                        <BreadcrumbRoute breadcrumb={{name: moduleId, suffix: search}}>
                            <DeviceEvents/>
                        </BreadcrumbRoute>
                    </DeviceEventsStateContextProvider>
                }
            />
            <Route
                path={`${ROUTE_PARTS.MODULE_PNP}/*`}
                element={
                    <BreadcrumbRoute breadcrumb={{name: moduleId, disableLink: true, suffix: search}}>
                        <Pnp/>
                    </BreadcrumbRoute>
                }
            />
        </Routes>
    );
};
