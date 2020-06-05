/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow } from 'enzyme';
import { DeviceIdentityCommandBar } from './deviceIdentityCommandBar';

const getComponent = (overrides = {}) => {
    const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
    const props = {
        connectionString,
        handleSave: jest.fn(),
        ...overrides,
    };
    return <DeviceIdentityCommandBar {...props} />;
};

describe('deviceIdentityCommandBar', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            expect(shallow(getComponent())).toMatchSnapshot();
        });

        it('matches snapshot with disabled save', () => {
            expect(shallow(getComponent({
                disableSave: true
            }))).toMatchSnapshot();
        });
    });
});
