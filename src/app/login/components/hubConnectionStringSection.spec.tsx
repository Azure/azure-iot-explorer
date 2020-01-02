/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Stack } from 'office-ui-fabric-react';
import { testSnapshot, mountWithLocalization } from '../../shared/utils/testHelpers';
import HubConnectionStringSection, { HubConnectionStringSectionDataProps, HubConnectionStringSectionActionProps } from './hubConnectionStringSection';

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
    };

    const connectivityStringSectionActionProps: HubConnectionStringSectionActionProps = {
        addNotification: jest.fn(),
        onChangeConnectionString: jest.fn(),
        onRemoveConnectionString: jest.fn()
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
    it('toggles iconbuttons disabled based on connectionstring', () => {
        let wrapper = mountWithLocalization(getComponent());
        let hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        let stackButtons = hubConnectionStringSection.find(Stack.Item)
            .findWhere(stackItem => stackItem.hasClass('connection-string-button'));
        stackButtons.forEach(stackItem => {
            const button = stackItem.find(IconButton);
            expect(button.props().disabled).toBeTruthy();
        });

        wrapper = mountWithLocalization(getComponent({
            connectionString: 'testConnection1',
            connectionStringList: ['testConnection1', 'testConnection2']
        }));
        hubConnectionStringSection = wrapper.find(HubConnectionStringSection);

        stackButtons = hubConnectionStringSection.find(Stack.Item)
            .findWhere(stackItem => stackItem.hasClass('connection-string-button'));
        stackButtons.forEach(stackItem => {
            const button = stackItem.find(IconButton);
            expect(button.props().disabled).toBeFalsy();
        });
    });
});
