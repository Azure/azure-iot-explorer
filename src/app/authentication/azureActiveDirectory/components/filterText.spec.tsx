/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { FilterTextBox, FilterType } from './filterTextBox';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';

describe('FilterTextBox', () => {
    it('matches snapshot', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [getInitialAzureActiveDirectoryState(), azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const wrapper = shallow(<FilterTextBox filterType={FilterType.IoTHub} setFilteredList={jest.fn()}/>);
        expect(wrapper).toMatchSnapshot();
    });
});
