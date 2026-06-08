/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
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
                        <Routes>
                            <Route path="/" element={<Navigate to={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.RESOURCES}`} replace/>}/>
                            <Route path={`${ROUTE_PARTS.RESOURCES}`} element={<AuthenticationView />} />
                            <Route path={`${ROUTE_PARTS.MODEL_REPOS}`} element={<ModelRepositoryLocationView />} />
                            <Route path={`${ROUTE_PARTS.NOTIFICATIONS}`} element={<NotificationList />} />
                        </Routes>
                    </AuthenticationStateContextProvider>
                </div>
            </div>
        </>
    );
};
