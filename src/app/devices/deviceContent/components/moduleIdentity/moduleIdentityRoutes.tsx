/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import ModuleIdentityListContainer from './moduleIdentityContainer';
import AddModuleIdentityContainer from './addModuleIdentityContainer';
import { ROUTE_PARTS } from '../../../../constants/routes';

export default class ModuleIdentityRoutes extends React.Component<RouteComponentProps> {
    public render(): JSX.Element {
        return (
            <>
                <Route exact={true} path={`${this.props.match.url}/`} component={ModuleIdentityListContainer}/>
                <Route exact={true} path={`${this.props.match.url}/${ROUTE_PARTS.ADD}/`} component={AddModuleIdentityContainer}/>
            </>
        );
    }
}
