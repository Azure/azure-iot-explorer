/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { CommandBar } from '@fluentui/react';
import { DirectMethod } from './directMethod';
import { invokeDirectMethodAction } from '../actions';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: '?deviceId=test' })
}));

describe('directMethod', () => {
    it('matches snapshot', () => {
        expect(shallow(<DirectMethod/>)).toMatchSnapshot();
    });

    it('invokes direct method', () => {
        const mockGetDeviceTwin = jest.spyOn(invokeDirectMethodAction, 'started');
        const realUseState = React.useState;
        // tslint:disable-next-line: no-magic-numbers
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(60));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState('method'));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(JSON.stringify({foo: 'bar'})));
        // tslint:disable-next-line: no-magic-numbers
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(20));

        const wrapper = mount(<DirectMethod/>);
        const commandBar = wrapper.find(CommandBar).first();
        act(() => commandBar.props().items[0].onClick(null));
        expect(mockGetDeviceTwin.mock.calls[0][0]).toEqual({
            connectTimeoutInSeconds: 60,
            deviceId: 'test',
            methodName: 'method',
            payload: {foo: 'bar'},
            responseTimeoutInSeconds: 20
        });
    });
});
