/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { NoMatchError } from './noMatchError';
import { ROUTE_PARTS } from '../../constants/routes';
import { HomeView } from '../../home/components/homeView';
import { DeviceList } from '../../devices/deviceList/components/deviceList';
import { AddDevice } from '../../devices/addDevice/components/addDevice';
import { DeviceContent } from '../../devices/deviceContent/deviceIdentity/components/deviceContent';
import { Breadcrumb } from './breadcrumb';
import { Header } from './header';
import '../../css/_application.scss';

const NOTIFICATION_AUTO_CLOSE = 5000;

export const Application: React.FC = () => {
    return (
        <div className="app">
            <div className="masthead">
                <Header />
            </div>
            <nav className="navigation">
                <Route component={Breadcrumb} />
            </nav>
            <main role="main" className="content">
                <Switch>
                    <Redirect from="/" exact={true} to={`${ROUTE_PARTS.HOME}`}/>
                    <Route path={`/${ROUTE_PARTS.HOME}`} component={HomeView} />
                    <Route path={`/${ROUTE_PARTS.RESOURCE}/:hostName/${ROUTE_PARTS.DEVICES}`} component={DeviceList} exact={true}/>
                    <Route path={`/${ROUTE_PARTS.RESOURCE}/:hostName/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.ADD}`} component={AddDevice} exact={true} />
                    <Route path={`/${ROUTE_PARTS.RESOURCE}/:hostName/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/`} component={DeviceContent}/>
                    <Route component={NoMatchError}/>
                </Switch>
            </main>
            <ToastContainer
                autoClose={NOTIFICATION_AUTO_CLOSE}
                toastClassName="toast-notification"
            />
        </div>
    );
};
