/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { AzureActiveDirectoryCommandBar } from './commandBar';

export const HubSelection: React.FC = () => {
    const [ { token, formState }, { getToken }] =  useAzureActiveDirectoryStateContext();

    React.useEffect(() => {
        getToken();
    },              []);

    return (
        <div>
            <AzureActiveDirectoryCommandBar/>
            {formState === 'working' && <MultiLineShimmer/>}
            {token}
        </div>
    );
};
