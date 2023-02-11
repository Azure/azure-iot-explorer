/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ROUTE_PARTS } from '../../constants/routes';
import { AppVersionMessageBar } from './appVersionMessageBar';
import { HomeViewNavigation } from './homeViewNavigation';
import { AuthenticationStateContextProvider } from '../../authentication/context/authenticationStateProvider';
import { AuthenticationView } from '../../authentication/components/authenticationView';
import { ModelRepositoryLocationView } from '../../modelRepository/view';
import { NotificationList } from '../../notifications/components/notificationList';

export const HomeView: React.FC = () => {
    const [ appMenuVisible, setAppMenuVisible ] = React.useState(true);
    return (
        <>
            <AppVersionMessageBar/>
            <div className={'mainarea' + (!appMenuVisible ? ' collapsed' : '')}>
                <div className={'mainleftnav' + (!appMenuVisible ? ' collapsed' : '')}>
                    <HomeViewNavigation
                        appMenuVisible={appMenuVisible}
                        setAppMenuVisible={setAppMenuVisible}
                    />
                </div>
                <div className="maincontent">
                    <AuthenticationStateContextProvider>
                        <Switch>
                            <Redirect from={`/${ROUTE_PARTS.HOME}`} to={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.RESOURCES}`} exact={true}/>
                            <Route path={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.RESOURCES}`} component={AuthenticationView} exact={true} />
                            <Route path={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}`} component={ModelRepositoryLocationView} exact={true} />
                            <Route path={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.NOTIFICATIONS}`} component={NotificationList} exact={true} />
                        </Switch>
                    </AuthenticationStateContextProvider>
                </div>
            </div>
        </>
    );
};
