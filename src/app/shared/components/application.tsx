/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { NoMatchError } from '../../navigation/components/noMatchError';
import { ROUTE_PARTS } from '../../constants/routes';
import { HomeView } from '../../home/components/homeView';
import { Breadcrumbs } from '../../navigation/components/breadcrumbs';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { IotHub } from '../../iotHub/components/iotHub';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { Header } from './header';
import { AuthenticationtateContextProvider } from '../contexts/authenticationStateContext';
import { useAuthenticationState } from '../authentication/hooks/authenticationStateHook';
import '../../css/_application.scss';
import '../../css/_mainArea.scss';

const NOTIFICATION_AUTO_CLOSE = 5000;

export const Application: React.FC = () => {
    const { t } = useTranslation();
    useBreadcrumbEntry({ name: t(ResourceKeys.common.home), suffix: 'home' });
    const [ authenticationState , authenticationApi] = useAuthenticationState();

    return (
        <div className="container">
            <div className="header">
                <Header />
            </div>
            <div className="topnav">
                <Breadcrumbs/>
            </div>
            <main className="main">
                <AuthenticationtateContextProvider value={[authenticationState, authenticationApi]}>
                <Switch>
                        <Redirect from="/" exact={true} to={`${ROUTE_PARTS.HOME}`}/>
                        <Route path={`/${ROUTE_PARTS.HOME}`} component={HomeView} />
                        <Route path={'/microsoft.devices/'} component={IotHub} />
                        <Route component={NoMatchError}/>
                    </Switch>
                </AuthenticationtateContextProvider>
            </main>
            <ToastContainer
                autoClose={NOTIFICATION_AUTO_CLOSE}
                toastClassName="toast-notification"
            />
        </div>
    );
};
