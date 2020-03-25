/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import Localizer from './localizer';

describe('localizer', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<Localizer />);
        expect(wrapper).toMatchSnapshot();
    });
});
