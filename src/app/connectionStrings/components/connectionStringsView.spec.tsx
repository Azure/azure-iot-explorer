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
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import * as AsyncSagaReducer from '../../shared/hooks/useAsyncSagaReducer';
import { connectionStringsStateInitial } from '../state';
import * as actions from '../actions';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() })
}));

describe('ConnectionStringsView', () => {
    it('matches snapshot when no connection strings', () => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([connectionStringsStateInitial(), jest.fn()]);
        const wrapper = shallow(<ConnectionStringsView/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when connection strings present', () => {
        const state = connectionStringsStateInitial().merge({ connectionStrings: ['connectionString1']});
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);

        const wrapper = shallow(<ConnectionStringsView/>);
        expect(wrapper).toMatchSnapshot();

    });

    it('matches snapshot when connection string count exceeds max', () => {
        const connectionStrings = new Array(CONNECTION_STRING_LIST_MAX_LENGTH + 1).map((s, i) => `connectionString${i}`);
        const state = connectionStringsStateInitial().merge({ connectionStrings });
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);

        const wrapper = shallow(<ConnectionStringsView/>);
        expect(wrapper).toMatchSnapshot();
    });

    describe('add scenario', () => {
        it('mounts edit view when add command clicked', () => {
            const state = connectionStringsStateInitial().merge({ connectionStrings: []});
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
            const upsertConnectionStringActionSpy = jest.spyOn(actions, 'upsertConnectionStringAction');
            const state = connectionStringsStateInitial().merge({ connectionStrings: []});
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);
            const wrapper = shallow(<ConnectionStringsView/>);
            act(() => {
                wrapper.find(CommandBar).props().items[0].onClick(undefined);
            });

            wrapper.update();
            const connectionStringEditView = wrapper.find(ConnectionStringEditView).first();

            act(() => connectionStringEditView.props().onCommit('newConnectionString'));
            wrapper.update();

            expect(upsertConnectionStringActionSpy).toHaveBeenCalledWith({ newConnectionString: 'newConnectionString', connectionString: '' });
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });
    });

    describe('edit scenario', () => {
        const connectionString = 'HostName=test.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key';
        it('mounts edit view when add command clicked', () => {
            const state = connectionStringsStateInitial().merge({ connectionStrings: [connectionString] });
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);
            const wrapper = mount(<ConnectionStringsView/>);

            act(() => wrapper.find(ConnectionString).props().onEditConnectionString(connectionString));
            wrapper.update();

            expect(wrapper.find(ConnectionStringEditView).length).toEqual(1);
        });

        it('upserts when edit view applied', () => {
            const upsertConnectionStringActionSpy = jest.spyOn(actions, 'upsertConnectionStringAction');
            const state = connectionStringsStateInitial().merge({ connectionStrings: [connectionString] });
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([state, jest.fn()]);
            const wrapper = mount(<ConnectionStringsView/>);

            act(() => wrapper.find(ConnectionString).first().props().onEditConnectionString(connectionString));
            wrapper.update();

            const connectionStringEditView = wrapper.find(ConnectionStringEditView).first();
            act(() => connectionStringEditView.props().onCommit('newConnectionString'));
            wrapper.update();

            expect(upsertConnectionStringActionSpy).toHaveBeenCalledWith({ newConnectionString: 'newConnectionString', connectionString });
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });
    });
});
