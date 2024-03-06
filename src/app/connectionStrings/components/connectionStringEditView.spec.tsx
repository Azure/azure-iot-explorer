/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { ConnectionStringEditView } from './connectionStringEditView';

describe('ConnectionStringEdit', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<ConnectionStringEditView/>);
        expect(wrapper).toMatchSnapshot();
    });
});
