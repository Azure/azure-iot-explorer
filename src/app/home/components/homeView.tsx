/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { ROUTE_PARTS } from '../../constants/routes';
import AppVersionMessageBar from './appVersionMessageBar';
import { HomeViewNavigation } from './homeViewNavigation';
import { AzureResourcesView } from '../../azureResources/components/azureResourcesView';
import { ModelRepositoriesView } from '../../modelRepository/components/modelRepositoriesView';
import './homeView.scss';

export type HomeViewProps = RouteComponentProps;

export const HomeView: React.FC<HomeViewProps> = props => {
    const { match } = props;

    return (
        <div>
            <AppVersionMessageBar/>

            <div className="home-view">
                <div className="nav">
                    <HomeViewNavigation/>
                </div>
                <div className="content">
                    <Route path={`${match.url}`} component={AzureResourcesView} exact={true} />
                    <Route path={`${match.url}/${ROUTE_PARTS.MODEL_REPOS}/`} component={ModelRepositoriesView} />
                </div>
            </div>
        </div>
    );
};
