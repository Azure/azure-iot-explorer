/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { setActiveAzureResourceByHostNameAction } from '../actions';
import { AzureResourceView, AzureResourceViewProps } from './azureResourceView';
import { getActiveAzureResourceSelector } from '../selectors';

export const AzureResourceViewContainer: React.FC = () => {
    const { pathname } = useLocation();
    const { hostName } = useParams();
    const activeAzureResource = useSelector(getActiveAzureResourceSelector);
    const dispatch = useDispatch();

    const setActiveAzureResourceByHostName = (host: string) => {
        dispatch(setActiveAzureResourceByHostNameAction({
            hostName: host
        }));
    };

    const viewProps: AzureResourceViewProps = {
        activeAzureResource,
        currentHostName: hostName,
        setActiveAzureResourceByHostName
    };

    return (
        <AzureResourceView {...viewProps} />
    );
};
