/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { RouteComponentProps } from 'react-router-dom';
import { ROUTE_PARAMS } from '../../constants/routes';

export const getDeviceIdFromQueryString = (props: RouteComponentProps) => {
    return new URLSearchParams(props.location.search).get(ROUTE_PARAMS.DEVICE_ID);
};

export const getInterfaceIdFromQueryString = (props: RouteComponentProps) => {
    return new URLSearchParams(props.location.search).get(ROUTE_PARAMS.INTERFACE_ID);
};
