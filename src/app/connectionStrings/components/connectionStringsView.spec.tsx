/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { ConnectionStringsView, ConnectionStringsViewProps } from './connectionStringsView';
import { ConnectionString } from './connectionString';
import { ConnectionStringEditView } from './connectionStringEditView';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';

describe('ConnectionStringsView', () => {
    it('matches snapshot when no connection strings', () => {
        const props: ConnectionStringsViewProps = {
            connectionStrings: [],
            onDeleteConnectionString: jest.fn(),
            onSelectConnectionString: jest.fn(),
            onUpsertConnectionString: jest.fn()
        };

        const wrapper = shallow(<ConnectionStringsView {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when connection strings present', () => {
        const props: ConnectionStringsViewProps = {
            connectionStrings: ['connectionString1'],
            onDeleteConnectionString: jest.fn(),
            onSelectConnectionString: jest.fn(),
            onUpsertConnectionString: jest.fn()
        };

        const wrapper = shallow(<ConnectionStringsView {...props}/>);
        expect(wrapper).toMatchSnapshot();

    });

    it('matches snapshot when connection string count exceeds max', () => {
        const connectionStrings = new Array(CONNECTION_STRING_LIST_MAX_LENGTH + 1).map((s, i) => `connectionString${i}`);
        const props: ConnectionStringsViewProps = {
            connectionStrings,
            onDeleteConnectionString: jest.fn(),
            onSelectConnectionString: jest.fn(),
            onUpsertConnectionString: jest.fn()
        };

        const wrapper = shallow(<ConnectionStringsView {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    describe('add scenario', () => {
        it('mounts edit view when add command clicked', () => {
            const props: ConnectionStringsViewProps = {
                connectionStrings: [],
                onDeleteConnectionString: jest.fn(),
                onSelectConnectionString: jest.fn(),
                onUpsertConnectionString: jest.fn()
            };

            const wrapper = mount(<MemoryRouter><ConnectionStringsView {...props}/></MemoryRouter>);
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);

            act(() => {
                wrapper.find(CommandBarButton).props().onClick(undefined);
            });

            wrapper.update();

            expect(wrapper.find(ConnectionStringEditView).length).toEqual(1);
        });

        it('dismisses when edit view dismissed', () => {
            const props: ConnectionStringsViewProps = {
                connectionStrings: [],
                onDeleteConnectionString: jest.fn(),
                onSelectConnectionString: jest.fn(),
                onUpsertConnectionString: jest.fn()
            };

            const wrapper = mount(<MemoryRouter><ConnectionStringsView {...props}/></MemoryRouter>);
            act(() => {
                wrapper.find(CommandBarButton).props().onClick(undefined);
            });

            wrapper.update();
            const connectionStringEditView = wrapper.find(ConnectionStringEditView).first();

            act(() => connectionStringEditView.props().onDismiss());
            wrapper.update();

            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });

        it('upserts when edit view applied', () => {
            const upsertSpy = jest.fn();
            const props: ConnectionStringsViewProps = {
                connectionStrings: [],
                onDeleteConnectionString: jest.fn(),
                onSelectConnectionString: jest.fn(),
                onUpsertConnectionString: upsertSpy
            };

            const wrapper = mount(<MemoryRouter><ConnectionStringsView {...props}/></MemoryRouter>);
            act(() => {
                wrapper.find(CommandBarButton).props().onClick(undefined);
            });

            wrapper.update();
            const connectionStringEditView = wrapper.find(ConnectionStringEditView).first();

            act(() => connectionStringEditView.props().onCommit('newConnectionString'));
            wrapper.update();

            expect(upsertSpy).toHaveBeenCalledWith('newConnectionString', '');
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });
    });

    describe('edit scenario', () => {
        const connectionString = 'HostName=test.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key';
        it('mounts edit view when add command clicked', () => {
            const props: ConnectionStringsViewProps = {
                connectionStrings: [connectionString],
                onDeleteConnectionString: jest.fn(),
                onSelectConnectionString: jest.fn(),
                onUpsertConnectionString: jest.fn()
            };

            const wrapper = shallow(<ConnectionStringsView {...props}/>);
            act(() => wrapper.find(ConnectionString).props().onEditConnectionString(connectionString));
            wrapper.update();

            expect(wrapper.find(ConnectionStringEditView).length).toEqual(1);
        });

        it('upserts when edit view applied', () => {
            const upsertSpy = jest.fn();
            const props: ConnectionStringsViewProps = {
                connectionStrings: [connectionString],
                onDeleteConnectionString: jest.fn(),
                onSelectConnectionString: jest.fn(),
                onUpsertConnectionString: upsertSpy
            };

            const wrapper = shallow(<ConnectionStringsView {...props}/>);
            act(() => wrapper.find(ConnectionString).first().props().onEditConnectionString(connectionString));
            wrapper.update();

            const connectionStringEditView = wrapper.find(ConnectionStringEditView).first();
            act(() => connectionStringEditView.props().onCommit('newConnectionString'));
            wrapper.update();

            expect(upsertSpy).toHaveBeenCalledWith('newConnectionString', connectionString);
            expect(wrapper.find(ConnectionStringEditView).length).toEqual(0);
        });
    });
});
