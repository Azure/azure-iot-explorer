/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ConnectionStringsView } from './connectionStringsView';
import { ConnectionString } from './connectionString';
import { ConnectionStringEditView } from './connectionStringEditView';
import { connectionStringsStateInitial } from '../state';
import * as HubConnectionStringHelper from '../../shared/utils/hubConnectionStringHelper';
import * as connectionStringContext from '../context/connectionStringStateContext';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useRouteMatch: () => ({ url: 'url', path: 'path'})
}));

describe('ConnectionStringsView', () => {
    const connectionStringWithExpiry = {connectionString: 'connectionString1', expiration: (new Date(0)).toUTCString()};

    it('matches snapshot when no connection strings', () => {
        jest.spyOn(connectionStringContext, 'useConnectionStringContext').mockReturnValue(
            [connectionStringsStateInitial(), {...connectionStringContext.getInitialConnectionStringOps()}]);
        const wrapper = shallow(<ConnectionStringsView/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when connection strings present', () => {
        const state = connectionStringsStateInitial().merge({ payload: [connectionStringWithExpiry]});
        jest.spyOn(connectionStringContext, 'useConnectionStringContext').mockReturnValue(
            [state, {...connectionStringContext.getInitialConnectionStringOps()}]);

        const wrapper = shallow(<ConnectionStringsView/>);
        expect(wrapper).toMatchSnapshot();

    });

    describe('edit scenario', () => {
        const connectionString = 'HostName=test.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key';
        it('mounts edit view when add command clicked', () => {
            const state = connectionStringsStateInitial().merge({ payload: [connectionStringWithExpiry] });
            jest.spyOn(connectionStringContext, 'useConnectionStringContext').mockReturnValue(
                [state, {...connectionStringContext.getInitialConnectionStringOps()}]);
            const wrapper = mount(<ConnectionStringsView/>);

            act(() => wrapper.find(ConnectionString).props().onEditConnectionString(connectionString));
            wrapper.update();

            expect(wrapper.find(ConnectionStringEditView).length).toEqual(1);
        });

        it('upserts when edit view applied', () => {
            const deleteConnectionString = jest.fn();
            const upsertConnectionString = jest.fn();
            const state = connectionStringsStateInitial().merge({ payload: [connectionStringWithExpiry] });
            jest.spyOn(connectionStringContext, 'useConnectionStringContext').mockReturnValue(
                [state, {...connectionStringContext.getInitialConnectionStringOps(), deleteConnectionString, upsertConnectionString}]);
            jest.spyOn(HubConnectionStringHelper, 'getExpiryDateInUtcString').mockReturnValue((new Date(0)).toUTCString());
            const wrapper = mount(<ConnectionStringsView/>);

            act(() => wrapper.find(ConnectionString).first().props().onEditConnectionString(connectionString));
            wrapper.update();

            const connectionStringEditView = wrapper.find(ConnectionStringEditView).first();
            act(() => connectionStringEditView.props().onCommit('newConnectionString'));
            wrapper.update();

            expect(deleteConnectionString).toHaveBeenCalledWith(connectionString);
            expect(upsertConnectionString).toHaveBeenCalledWith({ connectionString: 'newConnectionString', expiration: (new Date(0)).toUTCString() });
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });
    });
});
