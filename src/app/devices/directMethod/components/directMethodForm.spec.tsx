/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { TextField, Slider } from '@fluentui/react';
import { DirectMethodForm } from './directMethodForm';

describe('directMethodForm', () => {
    it('makes expected calls', () => {
        const mockSetMethodName = jest.fn();
        const mockSetPayload = jest.fn();
        const mockConnectionTimeOut = jest.fn();
        const mockResponseTimeOut = jest.fn();
        const wrapper = mount(
            <DirectMethodForm
                methodName={undefined as any}
                connectionTimeOut={0}
                responseTimeOut={0}
                setMethodName={mockSetMethodName}
                setPayload={mockSetPayload}
                setConnectionTimeOut={mockConnectionTimeOut}
                setResponseTimeOut={mockResponseTimeOut}
            />);

        act(() => wrapper.find(TextField).first().props().onChange?.(undefined as any, 'testMethod'));
        wrapper.update();
        expect(mockSetMethodName).toBeCalledWith('testMethod');

        act(() => wrapper.find(TextField).at(1).props().onChange?.(undefined as any, 'payload'));
        wrapper.update();
        expect(mockSetPayload).toBeCalledWith('payload');

        act(() => wrapper.find(Slider).first().props().onChange?.(10));
        wrapper.update();
        expect(mockConnectionTimeOut).toBeCalledWith(10);
        expect(mockResponseTimeOut).toBeCalledWith(10);

        act(() => wrapper.find(Slider).at(1).props().onChange?.(20));
        wrapper.update();
        expect(mockResponseTimeOut).toBeCalledWith(20);
    });
});
