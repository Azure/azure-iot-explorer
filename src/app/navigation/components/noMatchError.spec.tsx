/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react/lib/components/Button';
import { NoMatchError } from './noMatchError';

describe('shared/components/noMatchError', () => {

    it('renders title and button properly', () => {
        const wrapper = mount(<NoMatchError/>);
        expect(wrapper.find('div.no-match-error-description').find('h2').props().children).toEqual('noMatchError.title');
        expect(wrapper.find('div.no-match-error-description').find('p').props().children).toEqual('noMatchError.description');
        const button = wrapper.find(PrimaryButton).first();
        expect(button.props().ariaDescription).toEqual('noMatchError.goHome');
        expect(button.props().href).toEqual('#');
    });
});
