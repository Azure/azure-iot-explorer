/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, RouteComponentProps, Redirect } from 'react-router-dom';
import { ROUTE_PARTS } from '../../constants/routes';
import AppVersionMessageBar from './appVersionMessageBar';
import { HomeViewNavigation } from './homeViewNavigation';
import { AzureResourcesView } from '../../azureResources/components/azureResourcesView';
import { ModelRepositoryLocationViewContainer } from '../../modelRepository/components/modelRepositoryLocationView';
import './homeView.scss';

export type HomeViewProps = RouteComponentProps;

export const HomeView: React.FC<HomeViewProps> = props => {
    const { match } = props;

    const redirectToResources = () => {
        return <Redirect to={`${match.url}/${ROUTE_PARTS.RESOURCES}`}/>;
    };

    return (
        <div>
            <AppVersionMessageBar/>

            <div className="view-content home-view">
                <div className="nav">
                    <HomeViewNavigation/>
                </div>
                <div className="content">
                    <Route path={`${match.url}`} exact={true} render={redirectToResources} />
                    <Route path={`${match.url}/${ROUTE_PARTS.RESOURCES}/`} component={AzureResourcesView} exact={true} />
                    <Route path={`${match.url}/${ROUTE_PARTS.MODEL_REPOS}/`} component={ModelRepositoryLocationViewContainer} exact={true} />
                </div>
            </div>
        </div>
    );
};
