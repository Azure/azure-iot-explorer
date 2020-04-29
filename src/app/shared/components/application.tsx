/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AzureResourceViewContainer } from '../../azureResource/components/azureResourceViewContainer';
import { AzureResourcesView } from '../../azureResources/components/azureResourcesView';
import NoMatchError from './noMatchError';
import { ROUTE_PARTS } from '../../constants/routes';
import { withApplicationFrame } from './applicationFrame';

const NOTIFICATION_AUTO_CLOSE = 5000;

export const Application: React.FC = props => {

    const redirectToResources = () => {
        return <Redirect to={`/${ROUTE_PARTS.RESOURCE}/`} />;
    };

    return (
        <HashRouter>
            <>
                <Switch>
                    <Route path="/" exact={true} render={redirectToResources} />
                    <Route path={`/${ROUTE_PARTS.RESOURCE}/`} component={withApplicationFrame(AzureResourcesView)} exact={true} />
                    <Route path={`/${ROUTE_PARTS.RESOURCE}/:hostName`} component={withApplicationFrame(AzureResourceViewContainer)} />
                    <Route component={NoMatchError}/>
                </Switch>
                <ToastContainer
                    autoClose={NOTIFICATION_AUTO_CLOSE}
                    toastClassName="toast-notification"
                />
            </>
        </HashRouter>
    );
};
