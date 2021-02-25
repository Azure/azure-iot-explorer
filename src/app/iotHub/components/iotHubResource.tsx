/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, useRouteMatch, Redirect, Route } from 'react-router-dom';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { IotHubDevices } from './iotHubDevices';
import { ROUTE_PARTS } from '../../constants/routes';

export const IotHubResource = () => {
    const { resourceName } = useParams<{resourceName: string}>();
    const { url } = useRouteMatch();
    useBreadcrumbEntry({ name: resourceName });

    // putting redirects in separate host / resource views with intention to remove from resource once root view ready
    return (
        <>
            <Redirect from={url} to={`${url}/devices`} />
            <Route path={`${url}/${ROUTE_PARTS.DEVICES}`} component={(IotHubDevices)} />
        </>
    );
};
