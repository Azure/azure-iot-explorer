/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ConnectionStringEditView, ConnectionStringEditViewProps } from './connectionStringEditView';
import configureStore from '../../../app/shared/redux/store/configureStore';

describe('ConnectionStringEdit', () => {
    const connectionString = 'HostName=test.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key';

    it('matches snapshot in Add Scenario', () => {
        const props: ConnectionStringEditViewProps = {
            connectionStringUnderEdit: '',
            connectionStrings: [],
            onCommit: jest.fn(),
            onDismiss: jest.fn()
        };

        const wrapper = shallow(<ConnectionStringEditView {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot in Edit Scenario', () => {
        const props: ConnectionStringEditViewProps = {
            connectionStringUnderEdit: 'connectionString',
            connectionStrings: [],
            onCommit: jest.fn(),
            onDismiss: jest.fn()
        };

        const wrapper = shallow(<ConnectionStringEditView {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot in Edit / invalid scenario', () => {
        const props: ConnectionStringEditViewProps = {
            connectionStringUnderEdit: 'connectionString',
            connectionStrings: [],
            onCommit: jest.fn(),
            onDismiss: jest.fn()
        };

        const wrapper = shallow(<ConnectionStringEditView {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot in Edit / valid scenario', () => {
        const props: ConnectionStringEditViewProps = {
            connectionStringUnderEdit: connectionString,
            connectionStrings: [],
            onCommit: jest.fn(),
            onDismiss: jest.fn()
        };

        const wrapper = shallow(<ConnectionStringEditView {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('calls onDismiss when Cancel button clicked', () => {
        const onDismiss = jest.fn();
        const props: ConnectionStringEditViewProps = {
            connectionStringUnderEdit: 'connectionString',
            connectionStrings: [],
            onCommit: jest.fn(),
            onDismiss
        };

        const wrapper = mount(<ConnectionStringEditView {...props}/>);
        wrapper.find(DefaultButton).get(1).props.onClick(undefined);

        expect(onDismiss).toHaveBeenCalled();
    });

    describe('edit scenario', () => {
        it('disables commit when validation fails', () => {
            const props: ConnectionStringEditViewProps = {
                connectionStringUnderEdit: connectionString,
                connectionStrings: [],
                onCommit: jest.fn(),
                onDismiss: jest.fn()
            };

            const wrapper = mount(
                <Provider store={configureStore()}>
                     <ConnectionStringEditView {...props}/>
                </Provider>
           );
            act(() => wrapper.find(TextField).props().onChange(undefined, 'badConnectionString'));
            wrapper.update();

            const disabled = wrapper.find(PrimaryButton).props().disabled;
            expect(disabled).toEqual(true);
        });

        it('disables commit when duplicate validation', () => {
            const props: ConnectionStringEditViewProps = {
                connectionStringUnderEdit: '',
                connectionStrings: [connectionString],
                onCommit: jest.fn(),
                onDismiss: jest.fn()
            };

            const wrapper = mount(
                <Provider store={configureStore()}>
                     <ConnectionStringEditView {...props}/>
                </Provider>
           );
            act(() => wrapper.find(TextField).props().onChange(undefined, connectionString));
            wrapper.update();

            const disabled = wrapper.find(PrimaryButton).props().disabled;
            expect(disabled).toEqual(true);
        });

        it('calls onCommit when validation passes', () => {
            const onCommit = jest.fn();
            const props: ConnectionStringEditViewProps = {
                connectionStringUnderEdit: '',
                connectionStrings: [],
                onCommit,
                onDismiss: jest.fn()
            };

            const wrapper = mount(
                <Provider store={configureStore()}>
                     <ConnectionStringEditView {...props}/>
                </Provider>
           );
            act(() => wrapper.find(TextField).props().onChange(undefined, connectionString));
            wrapper.update();

            const commitButton = wrapper.find(PrimaryButton);
            expect(commitButton.props().disabled).toEqual(false);
            commitButton.props().onClick(undefined);

            expect(onCommit).toHaveBeenCalled();
        });

    });
});
