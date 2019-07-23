/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import AddDeviceComponent from './addDevice';
import { testWithLocalizationContext } from '../../../../../shared/utils/testHelpers';

describe('components/devices/addDevice', () => {

    const pathname = '/devices/add';
    const location: any = { // tslint:disable-line:no-any
        pathname,
    };
    const routerprops: any = { // tslint:disable-line:no-any
        history: {
            location,
        },
        location,
        match: {
            params: {
            }
        }
    };

    it('matches snapshot', () => {
        const wrapper = testWithLocalizationContext(
        <AddDeviceComponent
            {...routerprops}
            handleSave={jest.fn()}
            listDevices={jest.fn()}
        />);

        expect(wrapper).toMatchSnapshot();
    });
});
