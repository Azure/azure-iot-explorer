/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { ConnectionString, ConnectionStringProps } from './connectionString';
import { ConnectionStringDelete } from './connectionStringDelete';

describe('connectionString', () => {
    const connectionString = 'HostName=test.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key';
    it('matches snapshot', () => {
        const props: ConnectionStringProps = {
            connectionString,
            onDeleteConnectionString: jest.fn(),
            onEditConnectionString: jest.fn(),
            onSelectConnectionString: jest.fn()
        };

        const wrapper = shallow(<ConnectionString {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('calls onSelectConnectionString when link clicked', () => {
        const onSelectConnectionString = jest.fn();
        const props: ConnectionStringProps = {
            connectionString,
            onDeleteConnectionString: jest.fn(),
            onEditConnectionString: jest.fn(),
            onSelectConnectionString
        };

        const wrapper = shallow(<ConnectionString {...props}/>);
        wrapper.find(Link).first().props().onClick(undefined);

        expect(onSelectConnectionString).toHaveBeenCalledWith(connectionString);
    });

    it('calls onSelectConnectionString when convenience link clicked', () => {
        const onSelectConnectionString = jest.fn();
        const props: ConnectionStringProps = {
            connectionString,
            onDeleteConnectionString: jest.fn(),
            onEditConnectionString: jest.fn(),
            onSelectConnectionString
        };

        const wrapper = shallow(<ConnectionString {...props}/>);
        wrapper.find(Link).last().props().onClick(undefined);

        expect(onSelectConnectionString).toHaveBeenCalledWith(connectionString);
    });

    it('calls onEditConnectionString when edit button clicked', () => {
        const onEditConnectionString = jest.fn();
        const props: ConnectionStringProps = {
            connectionString,
            onDeleteConnectionString: jest.fn(),
            onEditConnectionString,
            onSelectConnectionString: jest.fn()
        };

        const wrapper = shallow(<ConnectionString {...props}/>);
        wrapper.find(IconButton).first().props().onClick(undefined);

        expect(onEditConnectionString).toHaveBeenCalledWith(connectionString);
    });

    describe('delete scenario', () => {
        it('launches delete confirmation when delete clicked', () => {
            const props: ConnectionStringProps = {
                connectionString,
                onDeleteConnectionString: jest.fn(),
                onEditConnectionString: jest.fn(),
                onSelectConnectionString: jest.fn()
            };

            const wrapper = shallow(<ConnectionString {...props}/>);
            wrapper.find(IconButton).get(1).props.onClick(undefined);
            wrapper.update();

            const connectionStringDelete = wrapper.find(ConnectionStringDelete);
            expect(connectionStringDelete.props().hidden).toEqual(false);
        });

        it('calls onDeleteConnectionString when ConnectionStringDelete confirmed', () => {
            const onDeleteConnectionString = jest.fn();
            const props: ConnectionStringProps = {
                connectionString,
                onDeleteConnectionString,
                onEditConnectionString: jest.fn(),
                onSelectConnectionString: jest.fn()
            };

            const wrapper = shallow(<ConnectionString {...props}/>);
            wrapper.find(IconButton).get(1).props.onClick(undefined);
            wrapper.update();

            const connectionStringDelete = wrapper.find(ConnectionStringDelete);
            connectionStringDelete.props().onDeleteConfirm();

            expect (onDeleteConnectionString).toHaveBeenCalledWith(connectionString);
        });

        it('hides delete confirmation when ConnnectionStringDelete canceled', () => {
            const props: ConnectionStringProps = {
                connectionString,
                onDeleteConnectionString: jest.fn(),
                onEditConnectionString: jest.fn(),
                onSelectConnectionString: jest.fn()
            };

            const wrapper = shallow(<ConnectionString {...props}/>);
            wrapper.find(IconButton).get(1).props.onClick(undefined);
            wrapper.update();

            const connectionStringDelete = wrapper.find(ConnectionStringDelete);
            expect(connectionStringDelete.props().hidden).toEqual(false);

            connectionStringDelete.props().onDeleteCancel();
            wrapper.update();

            const updatedConnectionStringDelete = wrapper.find(ConnectionStringDelete);
            expect(updatedConnectionStringDelete.props().hidden).toEqual(true);
        });
    });
});
