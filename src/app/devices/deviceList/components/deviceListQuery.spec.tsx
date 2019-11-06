/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { ActionButton, IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import DeviceListQuery, { DeviceListQueryProps, DeviceListQueryState } from './deviceListQuery';
import { testSnapshot, mountWithLocalization } from '../../../shared/utils/testHelpers';
import DeviceQueryClause from './deviceQueryClause';

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
        testSnapshot(getComponent());
    });

    it('sets device id', () => {
        const wrapper = mountWithLocalization(getComponent());
        const textField = wrapper.find(TextField).first();
        textField.instance().props.onChange({ target: null}, 'testDevice');
        wrapper.update();

        const deviceListQueryState = wrapper.state() as DeviceListQueryState;
        expect(deviceListQueryState.deviceId).toEqual('testDevice');
        wrapper.find(IconButton).first().props().onClick(null);
        expect(mockSetQueryAndExecute).toBeCalled();
    });

    it('adds query pills and execute query', () => {
        const wrapper = mountWithLocalization(getComponent());
        wrapper.find(ActionButton).first().props().onClick(null);
        wrapper.update();
        expect(wrapper.find(DeviceQueryClause)).toHaveLength(1);
        expect(wrapper.find(PrimaryButton)).toBeDefined();

        wrapper.find(PrimaryButton).first().props().onClick(null);
        expect(mockSetQueryAndExecute).toBeCalled();
    });
});
