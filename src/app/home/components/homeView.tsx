/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ROUTE_PARTS } from '../../constants/routes';
import { AppVersionMessageBar } from './appVersionMessageBar';
import { HomeViewNavigation } from './homeViewNavigation';
import { AzureResourcesView } from '../../azureResources/components/azureResourcesView';
import { ModelRepositoryLocationViewContainer } from '../../modelRepository/components/modelRepositoryLocationView';
import './homeView.scss';

export const HomeView: React.FC = () => {
    return (
        <div>
            <AppVersionMessageBar/>
            <div className="view-content home-view">
                <div className="nav">
                    <HomeViewNavigation/>
                </div>
                <div className="content">
                    <Switch>
                        <Redirect from={`/${ROUTE_PARTS.HOME}`} to={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.RESOURCES}`} exact={true}/>
                        <Route path={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.RESOURCES}`} component={AzureResourcesView} exact={true} />
                        <Route path={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}`} component={ModelRepositoryLocationViewContainer} exact={true} />
                    </Switch>
                </div>
            </div>
        </div>
    );
};
