/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DirectMethodForm } from './directMethodForm';

describe('DirectMethodForm', () => {
    const defaultProps = {
        methodName: '',
        connectionTimeOut: 10,
        responseTimeOut: 10,
        setMethodName: jest.fn(),
        setPayload: jest.fn(),
        setConnectionTimeOut: jest.fn(),
        setResponseTimeOut: jest.fn()
    };

    beforeEach(() => jest.clearAllMocks());

    it('renders method name input', () => {
        render(<DirectMethodForm {...defaultProps}/>);

        expect(screen.getByLabelText('directMethod.methodName')).toBeDefined();
    });

    it('renders payload textarea', () => {
        render(<DirectMethodForm {...defaultProps}/>);

        expect(screen.getByText('directMethod.payload')).toBeDefined();
    });

    it('renders connection and response timeout sliders', () => {
        render(<DirectMethodForm {...defaultProps}/>);

        expect(screen.getByLabelText('directMethod.connectionTimeout')).toBeDefined();
        expect(screen.getByLabelText('directMethod.responseTimeout')).toBeDefined();
    });

    it('calls setMethodName when method name input changes', () => {
        const setMethodName = jest.fn();
        render(<DirectMethodForm {...defaultProps} setMethodName={setMethodName}/>);

        const input = screen.getByLabelText('directMethod.methodName');
        fireEvent.change(input, { target: { value: 'testMethod' } });
        expect(setMethodName).toHaveBeenCalled();
    });
});
