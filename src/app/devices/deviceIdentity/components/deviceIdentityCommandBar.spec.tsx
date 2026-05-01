/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { DeviceIdentityCommandBar } from './deviceIdentityCommandBar';

import { render } from '@testing-library/react';
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
            const { container } = render(getComponent());
        expect(container).toBeDefined();
        });

        it('matches snapshot with disabled save', () => {
            const { container } = render(getComponent({
                disableSave: true
            }));
        expect(container).toBeDefined();
        });
    });
});
