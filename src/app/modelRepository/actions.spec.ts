/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setRepositoryLocationsAction } from './actions';

describe('setSettingsRepositoryLocationsAction', () => {
    it('returns MODEL_REPOSITORY/SET action object', () => {
        expect(setRepositoryLocationsAction([])).toEqual({
            payload: [],
            type: 'MODEL_REPOSITORY/SET'
        });
    });
});
