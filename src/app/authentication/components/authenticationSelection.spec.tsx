/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { CompoundButton } from '@fluentui/react';
import { AuthenticationSelection } from './authenticationSelection';
import { AuthenticationMethodPreference, getInitialAuthenticationState } from '../state';
import * as authenticationStateContext from '../context/authenticationStateContext';

describe('AuthenticationSelection', () => {
    it('matches snapshot', () => {
        jest.spyOn(authenticationStateContext, 'useAuthenticationStateContext').mockReturnValue(
            [getInitialAuthenticationState(), authenticationStateContext.getInitialAuthenticationOps()]);
        const wrapper = shallow(<AuthenticationSelection/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('calls api respectively', () => {
        const setLoginPreference = jest.fn();
        jest.spyOn(authenticationStateContext, 'useAuthenticationStateContext').mockReturnValue(
            [getInitialAuthenticationState(), {...authenticationStateContext.getInitialAuthenticationOps(), setLoginPreference}]);

        const wrapper = shallow(<AuthenticationSelection/>);

        wrapper.find(CompoundButton).get(0).props.onClick(undefined);
        wrapper.update();
        expect(setLoginPreference).toHaveBeenCalledWith(AuthenticationMethodPreference.ConnectionString);

        wrapper.find(CompoundButton).get(1).props.onClick(undefined);
        wrapper.update();
        expect(setLoginPreference).toHaveBeenCalledWith(AuthenticationMethodPreference.AzureAD);
    });
});
