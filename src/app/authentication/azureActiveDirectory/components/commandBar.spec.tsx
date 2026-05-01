/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';

import { AzureActiveDirectoryCommandBar } from './commandBar';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';
import * as authenticationStateContext from '../../../authentication/context/authenticationStateContext';
import { getInitialAuthenticationState } from '../../../authentication/state';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';

describe('AzureActiveDirectoryCommandBar', () => {
    it('matches snapshot when token is not present', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [getInitialAzureActiveDirectoryState(), azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const wrapper = shallow(<AzureActiveDirectoryCommandBar/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when token is present', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), token: 'token'}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const wrapper = shallow(<AzureActiveDirectoryCommandBar/>);
        expect(wrapper).toMatchSnapshot();
    });


    it('calls api respectively', () => {
        const logout = jest.fn();
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), token: 'token'}, {...azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps(), logout}]);

        const setLoginPreference = jest.fn();
        jest.spyOn(authenticationStateContext, 'useAuthenticationStateContext').mockReturnValue(
            [getInitialAuthenticationState(), {...authenticationStateContext.getInitialAuthenticationOps(), setLoginPreference}]);

        const wrapper = shallow(<AzureActiveDirectoryCommandBar/>);

        wrapper.find(CommandBar).props().items[0].onClick(undefined);
        wrapper.update();
        expect(logout).toHaveBeenCalled();

        wrapper.find(CommandBar).props().items[1].onClick(undefined);
        wrapper.update();

        expect(setLoginPreference).toHaveBeenCalledWith('');
    });
});
