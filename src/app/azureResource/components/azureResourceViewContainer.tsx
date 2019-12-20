/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { StateInterface } from '../../shared/redux/state';
import { setActiveAzureResourceByHostNameAction } from '../actions';
import { AzureResourceView, AzureResourceViewProps } from './azureResourceView';

export type AzureResourceViewContainerProps = RouteComponentProps;
export const AzureResourceViewContainer: React.FC<AzureResourceViewContainerProps> = props => {
    const currentUrl = props.match.url;
    const currentHostName = (props.match.params as { hostName: string}).hostName;
    const activeAzureResource = useSelector((state: StateInterface) => state.azureResourceState.activeAzureResource);
    const dispatch = useDispatch();

    const setActiveAzureResourceByHostName = (hostName: string) => {
        dispatch(setActiveAzureResourceByHostNameAction({
            hostName
        }));
    };

    const viewProps: AzureResourceViewProps = {
        activeAzureResource,
        currentHostName,
        currentUrl,
        setActiveAzureResourceByHostName
    };

    return <AzureResourceView {...viewProps} />;
};