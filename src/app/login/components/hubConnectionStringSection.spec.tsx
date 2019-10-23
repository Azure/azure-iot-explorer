/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { testSnapshot, mountWithLocalization } from '../../shared/utils/testHelpers';
import HubConnectionStringSection, { HubConnectionStringSectionDataProps, HubConnectionStringSectionActionProps, HubConnectionStringSectionState } from './hubConnectionStringSection';
import { MaskedCopyableTextField } from '../../shared/components/maskedCopyableTextField';

describe('login/components/connectivityPane', () => {
    const routerProps: any = { // tslint:disable-line:no-any
        history: {
            location,
            push: jest.fn()
        },
        location,
    };

    const connectivityStringSectionDataProps: HubConnectionStringSectionDataProps = {
        connectionString: '',
        connectionStringList: undefined,
        error: '',
        rememberConnectionString: true
    };

    const connectivityStringSectionActionProps: HubConnectionStringSectionActionProps = {
        onCheckboxChange: jest.fn(),
        onConnectionStringChangedFromDropdown: jest.fn(),
        onConnectionStringChangedFromTextField: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...connectivityStringSectionDataProps,
            ...connectivityStringSectionActionProps,
            ...routerProps,
            ...overrides
        };

        return (
            <HubConnectionStringSection {...props} />
        );
    };

    it('matches snapshot', () => {
        testSnapshot(getComponent());
    });

    it('adds new connection string', () => {
        const wrapper = mountWithLocalization(getComponent());
        const textField = wrapper.find(MaskedCopyableTextField);
        textField.props().onTextChange('newConnectionString1');
        wrapper.update();
        expect((wrapper.state() as HubConnectionStringSectionState).newConnectionString).toEqual('newConnectionString1');
    });

    it('renders add new connection string field when selecting \'Add\' from the dropdown', () => {
        const wrapper = mountWithLocalization(getComponent({connectionStringList: ['connectionString']}));
        const dropDown = wrapper.find(Dropdown);
        dropDown.props().onChange(null, {key: 'Add'} as any); // tslint:disable-line:no-any
        wrapper.update();
        expect((wrapper.state() as HubConnectionStringSectionState).showAddNewConnectionStringTextField).toBeTruthy();
    });
});
