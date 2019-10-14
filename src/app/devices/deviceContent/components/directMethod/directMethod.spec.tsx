/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DirectMethod, { DirectMethodProps } from './directMethod';
import { testSnapshot } from '../../../../shared/utils/testHelpers';
import { Theme } from '../../../../../themer';

describe('directMethod', () => {
    const directMethodProps: DirectMethodProps = {
        connectionString: 'testString',
        onInvokeMethodClick: jest.fn(),
        theme: Theme.light
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

    it('matches snapshot for light theme', () => {
        const component = getComponent({
            settingSchema: undefined
        });
        testSnapshot(component);
    });
    it('matches snapshot for dark theme', () => {
        const props = {
            ...{
                connectionString: 'testString',
                onInvokeMethodClick: jest.fn(),
                theme: Theme.dark
            },
            ...routerprops,
        };
        testSnapshot(<DirectMethod {...props} />);
    });
});
