/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { ApplicationClient } from './applicationInsightClient';

// tslint:disable-next-line: no-any
export function* loggerSaga(action: Action<any>) {
    yield ApplicationClient.getInstance().trackEvent({name: `action: ${action.type}`}, {type: 'action'});
}
