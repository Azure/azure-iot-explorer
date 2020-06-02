/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ROUTE_PARAMS } from '../../constants/routes';

export const getDeviceIdFromQueryString = (routeSearchParams: string) => {
    return new URLSearchParams(routeSearchParams).get(ROUTE_PARAMS.DEVICE_ID);
};

export const getInterfaceIdFromQueryString = (routeSearchParams: string) => {
    return new URLSearchParams(routeSearchParams).get(ROUTE_PARAMS.INTERFACE_ID);
};

export const getComponentNameFromQueryString = (routeSearchParams: string) => {
    return new URLSearchParams(routeSearchParams).get(ROUTE_PARAMS.COMPONENT_NAME);
};

export const getModuleIdentityIdFromQueryString = (routeSearchParams: string) => {
    return new URLSearchParams(routeSearchParams).get(ROUTE_PARAMS.MODULE_ID);
};
