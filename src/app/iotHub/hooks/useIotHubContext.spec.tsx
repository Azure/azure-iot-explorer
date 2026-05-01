/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useIotHubContext, IotHubContext } from './useIotHubContext';

const TestComponent: React.FC = () => {
    useIotHubContext();
    return <></>;
};

describe('useIotHubContext', () => {
    it('calls context with expected value', () => {
        const spy = jest.spyOn(React, 'useContext');

        render(<TestComponent/>);
        expect(spy).toHaveBeenCalledWith(IotHubContext)
    });
});