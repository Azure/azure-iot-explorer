/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import ModuleIdentityListContainer from './moduleIdentityContainer';
import AddModuleIdentityContainer from './addModuleIdentityContainer';
import ModuleIdentityDetailContainer from './moduleIdentityDetailContainer';
import ModuleIdentityTwinContainer from './moduleIdentityTwinContainer';
import { ROUTE_PARTS } from '../../../../constants/routes';

export const ModuleIdentityRoutes: React.FC = () => {
    const { url } = useRouteMatch();
    return (
        <>
            <Route exact={true} path={`${url}/`} component={ModuleIdentityListContainer}/>
            <Route exact={true} path={`${url}/${ROUTE_PARTS.ADD}/`} component={AddModuleIdentityContainer}/>
            <Route exact={true} path={`${url}/${ROUTE_PARTS.MODULE_DETAIL}/`} component={ModuleIdentityDetailContainer}/>
            <Route exact={true} path={`${url}/${ROUTE_PARTS.MODULE_TWIN}/`} component={ModuleIdentityTwinContainer}/>
        </>
    );
};
