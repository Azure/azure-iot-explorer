/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { Header } from './header';

describe('Header', () => {
    it('matches snapshot', () => {

        expect(shallow(<Header/>)).toMatchSnapshot();
    });
});
