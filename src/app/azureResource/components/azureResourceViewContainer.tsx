/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveAzureResourceByHostNameAction } from '../actions';
import { AzureResourceView, AzureResourceViewProps } from './azureResourceView';
import { getActiveAzureResourceSelector } from '../selectors';

export const AzureResourceViewContainer: React.FC = () => {
    const activeAzureResource = useSelector(getActiveAzureResourceSelector);
    const dispatch = useDispatch();

    const setActiveAzureResourceByHostName = (hostName: string) => {
        dispatch(setActiveAzureResourceByHostNameAction({
            hostName
        }));
    };

    const viewProps: AzureResourceViewProps = {
        activeAzureResource,
        setActiveAzureResourceByHostName
    };

    return (
        <AzureResourceView {...viewProps} />
    );
};
