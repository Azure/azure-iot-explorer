/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { azureResourceStateInitial, AzureResourceStateInterface } from './state';
import { setActiveAzureResourceAction } from './actions';
import { AzureResource } from './models/azureResource';

const reducer = reducerWithInitialState<AzureResourceStateInterface>(azureResourceStateInitial())
    .case(setActiveAzureResourceAction, (state: AzureResourceStateInterface, payload: AzureResource) => {
        state.activeAzureResource = payload;
        return state;
    });

export default reducer;
