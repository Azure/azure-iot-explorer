/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { MessageBarButton } from 'office-ui-fabric-react';
import { MemoryRouter, Redirect } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { InterfaceNotFoundMessageBar } from './interfaceNotFoundMessageBar';

describe('interfaceNotFoundMessageBar', () => {
    it('matches snapshot', () => {
        expect(shallow(<InterfaceNotFoundMessageBar/>)).toMatchSnapshot();
    });

    it ('issues redirect when button clicked', () => {
        const wrapper = mount(
            <MemoryRouter>
                <InterfaceNotFoundMessageBar />
            </MemoryRouter>
        );

        act(() => {
            wrapper.find(MessageBarButton).first().props().onClick(undefined);
        });

        wrapper.update();

        const redirect = wrapper.find(Redirect);
        expect(redirect.length).toBeGreaterThan(0);
    });
});
