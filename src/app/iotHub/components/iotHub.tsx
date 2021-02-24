/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, useRouteMatch, Switch, Route, useLocation } from 'react-router-dom';
import { useBreadcrumbContext } from '../hooks/useNavContext';

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

export interface BreadcrumbAnchorProps {
    name: string;
    link?: boolean;
}

export const BreadcrumbAnchor: React.FC<BreadcrumbAnchorProps> = ({ link, name, children}) => {
    const { registerEntry, unregisterEntry } = useBreadcrumbContext();
    const { path, url } = useRouteMatch();
    const { search } = useLocation();

    // tslint:disable-next-line: no-console
    console.log('path ' + path);
    // tslint:disable-next-line: no-console
    console.log('url ' + url);

    // tslint:disable-next-line: no-console
    console.log('search ' + search);

    React.useEffect(() => {
        registerEntry({ name, link, path, search, url });
        return () => {
            unregisterEntry({ name, link, path, search, url });
        };
    }, [url, search]); // tslint:disable-line: align

    return (
        <>{children}</>
    );
};

export const Host = () => {
    const { hostName } = useParams<{hostName: string}>();

    return (
        <>
            <div>Host</div>
            <BreadcrumbAnchor name={hostName}>
                <IotHubViews/>
            </BreadcrumbAnchor>
        </>
    );
};

export const Resource = () => {
    return (
        <BreadcrumbAnchor name="resource">
            <div>Resource</div>
            <IotHubViews/>
        </BreadcrumbAnchor>
    );
};
