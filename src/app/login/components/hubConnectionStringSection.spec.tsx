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
        addNotification: jest.fn(),
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

    it('renders MaskedCopyableTextField when selecting \'Add\' from the dropdown', () => {
        const wrapper = mountWithLocalization(getComponent({connectionStringList: ['connectionString']}), true);
        const dropDown = wrapper.find(Dropdown);
        dropDown.props().onChange(null, {key: 'Add'} as any); // tslint:disable-line:no-any
        wrapper.update();
        const textField = wrapper.find(MaskedCopyableTextField);
        expect(textField.length).toEqual(1);
    });
});
