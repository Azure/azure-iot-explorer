/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ListItemPublicRepo } from './listItemPublicRepo';

describe('ListItemPublicRepo', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(
            <ListItemPublicRepo />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
