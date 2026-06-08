/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
const useContextSpy = jest.fn();
jest.mock('react', () => {
    const actual = jest.requireActual('react');
    return {
        ...actual,
        useContext: (...args: any[]) => {
            useContextSpy(...args);
            return actual.useContext(...args);
        },
    };
});

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useIotHubContext, IotHubContext } from './useIotHubContext';

const TestComponent: React.FC = () => {
    useIotHubContext();
    return <></>;
};

describe('useIotHubContext', () => {
    it('calls context with expected value', () => {
        render(<TestComponent/>);
        expect(useContextSpy).toHaveBeenCalledWith(IotHubContext)
    });
});