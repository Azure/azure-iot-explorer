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
import { useBreadcrumbContext, BreadcrumbContext } from './useBreadcrumbContext';

const TestComponent: React.FC = () => {
    useBreadcrumbContext();
    return <></>;
};

describe('useBreadcrumbContext', () => {
    it('calls context with expected value', () => {
        render(<TestComponent/>);
        expect(useContextSpy).toHaveBeenCalledWith(BreadcrumbContext);
    });
});