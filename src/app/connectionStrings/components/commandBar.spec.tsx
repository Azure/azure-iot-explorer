/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { CommandBar } from '@fluentui/react';
import { ConnectionStringCommandBar } from './commandBar';
import { connectionStringsStateInitial } from '../state';
import * as connectionStringContext from '../context/connectionStringStateContext';
import * as authenticationStateContext from '../../authentication/context/authenticationStateContext';
import { getInitialAuthenticationState } from '../../authentication/state';

describe('ConnectionStringCommandBar', () => {
    it('matches snapshot', () => {
        jest.spyOn(connectionStringContext, 'useConnectionStringContext').mockReturnValue(
            [connectionStringsStateInitial(), connectionStringContext.getInitialConnectionStringOps()]);
        const wrapper = shallow(<ConnectionStringCommandBar onAddConnectionStringClick={jest.fn()}/>);
        expect(wrapper).toMatchSnapshot();
    });


    it('upserts when edit view applied', () => {
        const setLoginPreference = jest.fn();
        jest.spyOn(authenticationStateContext, 'useAuthenticationStateContext').mockReturnValue(
            [getInitialAuthenticationState(), {...authenticationStateContext.getInitialAuthenticationOps(), setLoginPreference}]);
        const wrapper = mount(<ConnectionStringCommandBar onAddConnectionStringClick={jest.fn()}/>);

        wrapper.find(CommandBar).props().items[1].onClick(undefined);
        wrapper.update();

        expect(setLoginPreference).toHaveBeenCalledWith('');
    });
});
