/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { MessageBarButton } from '@fluentui/react';
import { shallow, mount } from 'enzyme';
import { InterfaceNotFoundMessageBar } from './interfaceNotFoundMessageBar';

const navigateSpy = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => navigateSpy,
}));

describe('interfaceNotFoundMessageBar', () => {
    it('matches snapshot', () => {
        expect(shallow(<InterfaceNotFoundMessageBar/>)).toMatchSnapshot();
    });

    it ('issues redirect when button clicked', () => {
        const wrapper = mount(<InterfaceNotFoundMessageBar/>);

        act(() => {
            wrapper.find(MessageBarButton).first().props().onClick(undefined);
        });

        wrapper.update();

        expect(navigateSpy).toBeCalledWith('/home/repos?from');
    });
});
