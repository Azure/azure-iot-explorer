/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { HubList } from './hubList';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';

describe('HubList', () => {
    it('matches snapshot when there are no list items', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), formState: 'idle'}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const wrapper = shallow(<HubList/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when there are list items', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), iotHubs: [{
            name: 'hub',
            location: 'westus',
            id: 'id'
        }]}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const wrapper = shallow(<HubList/>);
        expect(wrapper).toMatchSnapshot();
    });
});
