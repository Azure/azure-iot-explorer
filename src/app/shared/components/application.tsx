/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import DeviceLayout from '../../devices/layoutContainer';
import NoMatchError from './noMatchError';
import { LocalizationContextProvider } from '../contexts/localizationContext';
import connectivityPaneContainer from '../../login/components/connectivityPaneContainer';
import '../../css/_app.scss';

const TRANSLATION_NAMESPACE = 'translation';
const NOTIFICATION_AUTO_CLOSE = 5000;

// tslint:disable-next-line:no-any
const app = (localizationContext: any) => {
    return (
        <LocalizationContextProvider value={localizationContext}>
            <HashRouter>
                <>
                    <Switch>
                        <Route exact={true} path="/" component={connectivityPaneContainer}/>
                        <Route path="/devices" component={DeviceLayout}/>
                        <Route component={NoMatchError}/>
                    </Switch>
                    <ToastContainer
                        autoClose={NOTIFICATION_AUTO_CLOSE}
                        toastClassName="toast-notification"
                    />
                </>
            </HashRouter>
        </LocalizationContextProvider>
    );
};

export default withNamespaces(TRANSLATION_NAMESPACE)(app);
