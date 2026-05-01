/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@fluentui/react-components';
import { ConnectionStringDelete, ConnectionStringDeleteProps } from './connectionStringDelete';

describe('ConnectionStringDelete', () => {
    it('matches snapshot hidden', () => {
        const props: ConnectionStringDeleteProps = {
            connectionString: 'connectionString',
            hidden: true,
            onDeleteCancel: jest.fn(),
            onDeleteConfirm: jest.fn(),
        };

        const wrapper = shallow(<ConnectionStringDelete {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot visible', () => {
        const props: ConnectionStringDeleteProps = {
            connectionString: 'connectionString',
            hidden: false,
            onDeleteCancel: jest.fn(),
            onDeleteConfirm: jest.fn(),
        };

        const wrapper = shallow(<ConnectionStringDelete {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('calls onDeleteCancel when Cancel clicked', () => {
        const onDeleteCancel = jest.fn();
        const props: ConnectionStringDeleteProps = {
            connectionString: 'connectionString',
            hidden: false,
            onDeleteCancel,
            onDeleteConfirm: jest.fn(),
        };

        const wrapper = shallow(<ConnectionStringDelete {...props}/>);
        wrapper.find(Button).at(1).props().onClick(undefined);

        expect(onDeleteCancel).toHaveBeenCalled();
    });

    it('calls onDeleteConfirm when Confirm clicked', () => {
        const onDeleteConfirm = jest.fn();
        const props: ConnectionStringDeleteProps = {
            connectionString: 'connectionString',
            hidden: false,
            onDeleteCancel: jest.fn(),
            onDeleteConfirm
        };

        const wrapper = shallow(<ConnectionStringDelete {...props}/>);
        wrapper.find(Button).at(0).props().onClick(undefined);

        expect(onDeleteConfirm).toHaveBeenCalled();
    });
});
