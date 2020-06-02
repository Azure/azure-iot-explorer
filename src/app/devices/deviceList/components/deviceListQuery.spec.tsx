/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { ActionButton, IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DeviceListQuery, DeviceListQueryProps } from './deviceListQuery';
import { DeviceQueryClause } from './deviceQueryClause';

describe('components/devices/DeviceListQuery', () => {
    const mockSetQueryAndExecute = jest.fn();
    const deviceListQueryProps: DeviceListQueryProps = {
        refresh: 0,
        setQueryAndExecute: mockSetQueryAndExecute
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceListQueryProps,
            ...overrides
        };

        return (
            <DeviceListQuery
                {...props}
            />
        );
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });

    it('sets device id', () => {
        const wrapper = mount(getComponent());
        const textField = wrapper.find(TextField).first();
        act(() => textField.instance().props.onChange({ target: null}, 'testDevice'));
        wrapper.update();

        expect(wrapper.find(TextField).props().value).toEqual('testDevice');
        wrapper.find(IconButton).first().props().onClick(null);
        expect(mockSetQueryAndExecute).toBeCalled();
    });

    it('adds query pills and execute query', () => {
        const wrapper = mount(getComponent());
        act(() => wrapper.find(ActionButton).first().props().onClick(null));
        wrapper.update();

        expect(wrapper.find(DeviceQueryClause)).toHaveLength(1);
        expect(wrapper.find(PrimaryButton)).toBeDefined();

        act(() => wrapper.find(PrimaryButton).first().props().onClick(null));
        expect(mockSetQueryAndExecute).toBeCalled();
    });
});
