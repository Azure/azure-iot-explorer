/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useRouteMatch, Route } from 'react-router-dom';
import { IotHubHost } from './iotHubHost';
import { IotHubResource } from './iotHubResource';
import { ROUTE_PARTS } from '../../constants/routes';

export const IotHub: React.FC = () => {
    const { url }  = useRouteMatch();

    return (
        <>
            <Route path={`${url}/${ROUTE_PARTS.HOST_NAME}/:hostName`} component={IotHubHost} />
            <Route path={`${url}/${ROUTE_PARTS.RESOURCE}/:subscription/:resourceGroup/:resourceName`} component={IotHubResource} />
        </>
    );
};
