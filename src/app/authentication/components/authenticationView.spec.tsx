/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { AuthenticationView } from './authenticationView';
import { AuthenticationMethodPreference, getInitialAuthenticationState } from '../state';
import * as authenticationStateContext from '../context/authenticationStateContext';

describe('AuthenticationView', () => {
    it('matches snapshot when page is loading', () => {
        jest.spyOn(authenticationStateContext, 'useAuthenticationStateContext').mockReturnValue(
            [{...getInitialAuthenticationState(), formState: 'working'}, authenticationStateContext.getInitialAuthenticationOps()]);
        const wrapper = shallow(<AuthenticationView/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when preference not set', () => {
        jest.spyOn(authenticationStateContext, 'useAuthenticationStateContext').mockReturnValue(
            [getInitialAuthenticationState(), authenticationStateContext.getInitialAuthenticationOps()]);
        const wrapper = shallow(<AuthenticationView/>);
        expect(wrapper).toMatchSnapshot();
    });


    it('matches snapshot when preference is aad', () => {
        jest.spyOn(authenticationStateContext, 'useAuthenticationStateContext').mockReturnValue(
            [{...getInitialAuthenticationState(), preference: AuthenticationMethodPreference.AzureAD}, authenticationStateContext.getInitialAuthenticationOps()]);
        const wrapper = shallow(<AuthenticationView/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when preference is connection string', () => {
        jest.spyOn(authenticationStateContext, 'useAuthenticationStateContext').mockReturnValue(
            [{...getInitialAuthenticationState(), preference: AuthenticationMethodPreference.ConnectionString}, authenticationStateContext.getInitialAuthenticationOps()]);
        const wrapper = shallow(<AuthenticationView/>);
        expect(wrapper).toMatchSnapshot();
    });
});
