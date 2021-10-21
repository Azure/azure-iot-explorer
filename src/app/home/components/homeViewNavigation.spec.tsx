/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { HomeViewNavigation } from './homeViewNavigation';

describe('homeViewNavigation', () => {
    it('matches snapshot', () => {
        expect(shallow(<HomeViewNavigation appMenuVisible={true} setAppMenuVisible={jest.fn()}/>)).toMatchSnapshot();
    });
});
