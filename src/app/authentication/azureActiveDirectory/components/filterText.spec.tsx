/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { FilterTextBox, FilterType } from './filterTextBox';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';

import { render } from '@testing-library/react';
describe('FilterTextBox', () => {
    it('matches snapshot', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [getInitialAzureActiveDirectoryState(), azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<FilterTextBox filterType={FilterType.IoTHub} setFilteredList={jest.fn()}/>);
        expect(container).toBeDefined();
    });
});
