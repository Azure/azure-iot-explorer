/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import { Button } from '@fluentui/react-components';
import { NoMatchError } from './noMatchError';

describe('shared/components/noMatchError', () => {

    it('renders title and button properly', () => {
        const wrapper = mount(<NoMatchError/>);
        expect(wrapper.find('div.no-match-error-description').find('h2').props().children).toEqual('noMatchError.title');
        expect(wrapper.find('div.no-match-error-description').find('p').props().children).toEqual('noMatchError.description');
        const button = wrapper.find(Button).first();
        expect(button.props().children).toEqual('noMatchError.goHome');
        expect(button.props().href).toEqual('#');
    });
});
