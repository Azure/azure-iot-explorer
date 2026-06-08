/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IotHubHost } from './iotHubHost';
import { IotHubResource } from './iotHubResource';
import { ROUTE_PARTS } from '../../constants/routes';

export const IotHub: React.FC = () => {
    return (
        <Routes>
            <Route path={`${ROUTE_PARTS.HOST_NAME}/:hostName/*`} element={<IotHubHost />} />
            <Route path={`${ROUTE_PARTS.RESOURCE}/:subscription/:resourceGroup/:resourceName/*`} element={<IotHubResource />} />
        </Routes>
    );
};
