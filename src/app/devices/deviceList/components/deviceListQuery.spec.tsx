/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Button, Input } from '@fluentui/react-components';
import { DeviceListQuery, DeviceListQueryProps } from './deviceListQuery';
import { DeviceQueryClause } from './deviceQueryClause';

describe('DeviceListQuery', () => {
    const mockSetQueryAndExecute = jest.fn();
    const deviceListQueryProps: DeviceListQueryProps = {
        refresh: 0,
        setQueryAndExecute: mockSetQueryAndExecute
    };

    const getComponent = () => {
        return (
            <DeviceListQuery
                {...deviceListQueryProps}
            />
        );
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });

    it('sets device id', () => {
        const wrapper = mount(getComponent());
        const input = wrapper.find(Input).first();
        act(() => input.props().onChange?.({} as any, { value: 'testDevice' }));
        wrapper.update();

        expect(wrapper.find(Input).props().value).toEqual('testDevice');
        wrapper.find(Button).first().props().onClick(null);
        expect(mockSetQueryAndExecute).toBeCalled();
    });

    it('adds query pills and execute query', () => {
        const wrapper = mount(getComponent());
        act(() => wrapper.find(Button).filterWhere(n => n.prop('appearance') === 'transparent').first().props().onClick(null));
        wrapper.update();

        expect(wrapper.find(DeviceQueryClause)).toHaveLength(1);
        expect(wrapper.find(Button).filterWhere(n => n.prop('appearance') === 'primary')).toBeDefined();

        act(() => wrapper.find(Button).filterWhere(n => n.prop('appearance') === 'primary').first().props().onClick(null));
        expect(mockSetQueryAndExecute).toBeCalled();
    });
});
