/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, useRouteMatch, Switch, Route } from 'react-router-dom';

export const IotHub: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const { url}  = useRouteMatch();

    // tslint:disable-next-line: no-console
    console.log('url' + url);

    return (
        <>
            <div>Here we are</div>
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
    return (
        <div>Add Device</div>
    );
};

export const DeviceContent = () => {
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
    const match = useRouteMatch();
    // tslint:disable-next-line: no-console
    console.log('host path' + match.path);
    // tslint:disable-next-line: no-console
    console.log('host url' + match.url);
    return (
        <>
            <div>Host</div>
            <IotHubViews/>
        </>
    );
};

export const Resource = () => {
    const match = useRouteMatch();
    // tslint:disable-next-line: no-console
    console.log('resource path' + match.path);
    // tslint:disable-next-line: no-console
    console.log('resource url' + match.url);
    return (
        <>
            <div>Resource</div>
            <IotHubViews/>
        </>
    );
};
