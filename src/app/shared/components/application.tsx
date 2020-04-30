/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AzureResourceViewContainer } from '../../azureResource/components/azureResourceViewContainer';
import NoMatchError from './noMatchError';
import { ROUTE_PARTS } from '../../constants/routes';
import { HomeView } from '../../home/components/homeView';
import { withApplicationFrame } from './applicationFrame';

const NOTIFICATION_AUTO_CLOSE = 5000;

export const Application: React.FC = props => {
    const redirectHome = () => {
        return <Redirect to={`/${ROUTE_PARTS.HOME}/`} />;
    };

    return (
        <HashRouter>
            <>
                <Switch>
                    <Route path={`/`} exact={true} render={redirectHome}/>
                    <Route path={`/${ROUTE_PARTS.HOME}/`} component={withApplicationFrame(HomeView)} />
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
