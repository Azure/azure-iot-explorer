/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DeviceEventsComponent from './deviceEvents';
import { testWithLocalizationContext } from '../../../../shared/utils/testHelpers';

describe('components/devices/deviceEvents', () => {

    const pathname = `#/devices/detail/events/?id=device1`;

    const location: any = { // tslint:disable-line:no-any
        pathname
    };

    const routerProps: any = { // tslint:disable-line:no-any
        history: {
            location
        },
        location,
        match: {}
    };

    const getComponent = (overrides = {}) => {
        const props = {
            connectionString: '',
            ...routerProps,
            ...overrides,
        };
        return testWithLocalizationContext(<DeviceEventsComponent {...props} />);
    };

    it('matches snapshot', () => {
        const wrapper = getComponent();
        expect(wrapper).toMatchSnapshot();
    });
});
