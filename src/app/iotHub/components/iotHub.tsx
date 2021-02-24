/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, useRouteMatch, Switch, Route } from 'react-router-dom';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';

export const IotHub: React.FC = () => {
    const { url }  = useRouteMatch();

    return (
        <>
            <Switch>
                <Route path={`${url}/host/:hostName`} component={Host} />
                <Route path={`${url}/resource/:subscription/:resourceGroup/:resourceName`} component={Resource} />
                <Route component={NotFound} />
            </Switch>
        </>
    );
};

export const IotHubViews: React.FC = () => {
    const { url}  = useRouteMatch();
    useBreadcrumbEntry({ name: 'Devices', suffix: 'devices'});

    return (
        <Switch>
            <Route path={`${url}/devices`} render={(DeviceList)} exact={true}/>
            <Route path={`${url}/devices/add`} component={AddDevice} exact={true} />
            <Route path={`${url}/devices/details/`} component={DeviceContent}/>
        </Switch>
    );
};

export const DeviceList = () => {
    return (
        <div>DeviceList</div>
    );
};

export const AddDevice = () => {
    useBreadcrumbEntry({ name: 'Add Device'});

    return (
        <div>Add Device</div>
    );
};

export const DeviceContent = () => {
    useBreadcrumbEntry({ name: 'my device'});

    return (
        <div>DeviceContent</div>
    );
};

export const NotFound = () => {
    return (
        <div>Not Here</div>
    );
};

export const Host = () => {
    const { hostName } = useParams<{hostName: string}>();
    useBreadcrumbEntry({ name: hostName });

    return (
        <>
            <div>Host</div>
            <IotHubViews/>
        </>
    );
};

export const Resource = () => {
    const { resourceName } = useParams<{resourceName: string}>();
    useBreadcrumbEntry({ name: resourceName });

    return (
        <>
            <div>Resource</div>
            <IotHubViews/>
        </>
    );
};
