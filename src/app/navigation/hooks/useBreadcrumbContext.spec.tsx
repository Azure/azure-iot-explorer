/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useBreadcrumbContext, BreadcrumbContext } from './useBreadcrumbContext';

const TestComponent: React.FC = () => {
    useBreadcrumbContext();
    return <></>;
};

describe('useBreadcrumbContext', () => {
    it('calls context with expected value', () => {
        const spy = jest.spyOn(React, 'useContext');

        render(<TestComponent/>);
        expect(spy).toHaveBeenCalledWith(BreadcrumbContext);
    });
});