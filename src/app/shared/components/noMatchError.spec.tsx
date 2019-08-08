/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import NoMatchError from './noMatchError';
import { mountWithLocalization } from '../utils/testHelpers';

describe('shared/components/noMatchError', () => {

    it('matches snapshot', () => {
        expect(mountWithLocalization(<NoMatchError/>)).toMatchSnapshot();
    });
});
