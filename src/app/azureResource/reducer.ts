/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { azureResourceStateInitial, AzureResourceState } from './state';
import { setActiveAzureResourceAction } from './actions';
import { AzureResource } from './models/azureResource';

const reducer = reducerWithInitialState<AzureResourceState>(azureResourceStateInitial())
    .case(setActiveAzureResourceAction, (state: AzureResourceState, payload: AzureResource) => {
        state.currentAzureResource = payload;
        return state;
    });

export default reducer;
