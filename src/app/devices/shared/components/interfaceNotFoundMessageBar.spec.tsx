/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { MessageBarButton } from 'office-ui-fabric-react/lib/components/Button';
import { shallow, mount } from 'enzyme';
import { InterfaceNotFoundMessageBar } from './interfaceNotFoundMessageBar';

const histroyPushSpy = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: histroyPushSpy }),
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

        expect(histroyPushSpy).toBeCalledWith('/home/repos?from');
    });
});
