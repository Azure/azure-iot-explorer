/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { RouteComponentProps } from 'react-router-dom';

export const getDeviceIdFromQueryString = (props: RouteComponentProps) => {
    return new URLSearchParams(props.location.search).get('id');
};

export const getInterfaceIdFromQueryString = (props: RouteComponentProps) => {
    return new URLSearchParams(props.location.search).get('interfaceId');
};
