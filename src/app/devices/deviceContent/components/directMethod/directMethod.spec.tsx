/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DirectMethod, { DirectMethodProps } from './directMethod';
import { testSnapshot } from '../../../../shared/utils/testHelpers';

describe('directMethod', () => {
    const directMethodProps: DirectMethodProps = {
        connectionString: 'testString',
        onInvokeMethodClick: jest.fn()
    };

    const routerprops: any = { // tslint:disable-line:no-any
        history: {
            location
        },
        location,
        match: {}
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...directMethodProps,
            ...routerprops,
            ...overrides
        };

        return <DirectMethod {...props} />;
    };

    it('matches snapshot', () => {
        const component = getComponent({
            settingSchema: undefined
        });
        testSnapshot(component);
    });
});
