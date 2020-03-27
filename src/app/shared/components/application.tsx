/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AzureResourceViewContainer } from '../../azureResource/components/azureResourceViewContainer';
import NoMatchError from './noMatchError';
import connectivityPaneContainer from '../../login/components/connectivityPaneContainer';
import { ROUTE_PARTS } from '../../constants/routes';
import { withApplicationFrame } from './applicationFrame';

const NOTIFICATION_AUTO_CLOSE = 5000;

// tslint:disable-next-line:no-any
export const Application: React.FC = props => {
    return (
        <HashRouter>
            <>
                <Switch>
                    <Route path="/" component={connectivityPaneContainer} exact={true} />
                    <Route path={`/${ROUTE_PARTS.RESOURCE}/`} component={withApplicationFrame(AzureResourceViewContainer)} exact={true} />
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
