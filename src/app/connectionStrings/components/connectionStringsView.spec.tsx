/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { ConnectionStringsView } from './connectionStringsView';
import { ConnectionString } from './connectionString';
import { ConnectionStringEditView } from './connectionStringEditView';
import * as AsyncSagaReducer from '../../shared/hooks/useAsyncSagaReducer';
import { connectionStringsStateInitial } from '../state';
import { deleteConnectionStringAction, upsertConnectionStringAction } from '../actions';
import * as HubConnectionStringHelper from '../../shared/utils/hubConnectionStringHelper';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useRouteMatch: () => ({ url: 'url', path: 'path'})
}));

describe('ConnectionStringsView', () => {
    const connectionStringWithExpiry = {connectionString: 'connectionString1', expiration: (new Date(0)).toUTCString()};

    it('matches snapshot when no connection strings', () => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([connectionStringsStateInitial(), jest.fn()]);
        const wrapper = shallow(<ConnectionStringsView/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when connection strings present', () => {
        const state = connectionStringsStateInitial().merge({ payload: [connectionStringWithExpiry]});
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);

        const wrapper = shallow(<ConnectionStringsView/>);
        expect(wrapper).toMatchSnapshot();

    });

    describe('add scenario', () => {
        it('mounts edit view when add command clicked', () => {
            const state = connectionStringsStateInitial().merge({ payload: []});
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);
            const wrapper = shallow(<ConnectionStringsView/>);
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);

            act(() => {
                wrapper.find(CommandBar).props().items[0].onClick(undefined);
            });

            wrapper.update();
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(1);

            act(() => wrapper.find(ConnectionStringEditView).first().props().onDismiss());
            wrapper.update();

            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });

        it('upserts when edit view applied', () => {
            const upsertConnectionStringActionSpy = jest.spyOn(upsertConnectionStringAction, 'started');
            const state = connectionStringsStateInitial().merge({ payload: []});
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);
            jest.spyOn(HubConnectionStringHelper, 'getExpiryDateInUtcString').mockReturnValue((new Date(0)).toUTCString());

            const wrapper = shallow(<ConnectionStringsView/>);
            act(() => {
                wrapper.find(CommandBar).props().items[0].onClick(undefined);
            });

            wrapper.update();
            const connectionStringEditView = wrapper.find(ConnectionStringEditView).first();

            act(() => connectionStringEditView.props().onCommit('newConnectionString'));
            wrapper.update();

            expect(upsertConnectionStringActionSpy).toHaveBeenCalledWith({ connectionString: 'newConnectionString', expiration: (new Date(0)).toUTCString() });
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });
    });

    describe('edit scenario', () => {
        const connectionString = 'HostName=test.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key';
        it('mounts edit view when add command clicked', () => {
            const state = connectionStringsStateInitial().merge({ payload: [connectionStringWithExpiry] });
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);
            const wrapper = mount(<ConnectionStringsView/>);

            act(() => wrapper.find(ConnectionString).props().onEditConnectionString(connectionString));
            wrapper.update();

            expect(wrapper.find(ConnectionStringEditView).length).toEqual(1);
        });

        it('upserts when edit view applied', () => {
            const upsertConnectionStringActionSpy = jest.spyOn(upsertConnectionStringAction, 'started');
            const deleteConnectionStringActionSpy = jest.spyOn(deleteConnectionStringAction, 'started');
            const state = connectionStringsStateInitial().merge({ payload: [connectionStringWithExpiry] });
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);
            jest.spyOn(HubConnectionStringHelper, 'getExpiryDateInUtcString').mockReturnValue((new Date(0)).toUTCString());
            const wrapper = mount(<ConnectionStringsView/>);

            act(() => wrapper.find(ConnectionString).first().props().onEditConnectionString(connectionString));
            wrapper.update();

            const connectionStringEditView = wrapper.find(ConnectionStringEditView).first();
            act(() => connectionStringEditView.props().onCommit('newConnectionString'));
            wrapper.update();

            expect(deleteConnectionStringActionSpy).toHaveBeenCalledWith(connectionString);
            expect(upsertConnectionStringActionSpy).toHaveBeenCalledWith({ connectionString: 'newConnectionString', expiration: (new Date(0)).toUTCString() });
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });
    });
});
