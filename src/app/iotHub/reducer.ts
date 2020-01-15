/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setSharedAccessSignatureAuthorizationRules, SetSharedAccessSignatureAuthorizationRulesParameters } from './actions';
import { iotHubStateInitial, IotHubStateInterface } from './state';

const reducer = reducerWithInitialState<IotHubStateInterface>(iotHubStateInitial())
    .case(setSharedAccessSignatureAuthorizationRules, (state: IotHubStateInterface, payload: SetSharedAccessSignatureAuthorizationRulesParameters) => {
        const updatedState = {...state};
        updatedState.sharedAccessSignatureAuthorizationRules = updatedState.sharedAccessSignatureAuthorizationRules.set(payload.hubName, {
            lastRetrieved: Date.now(),
            payload: payload.sharedAccessSignatureAuthorizationRules
        });
        return updatedState;
    });

export default reducer;
