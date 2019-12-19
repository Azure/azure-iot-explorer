/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DeviceLayout } from './layout';

describe('components/devices/deviceEvents', () => {

    const pathname = `#/devices/detail/digitalTwins/events/?id=device1&interfaceId=urn:contoso:com:EnvironmentalSensor:1`;

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
            hubConnectionString: '',
            ...routerProps,
            ...overrides
        };
        return (<DeviceLayout {...props} />);
    };

    it('matches snapshot', () => {
        const wrapper = shallow(getComponent());
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('Redirect').first().prop('to')).toBe('/');
    });

    it('matches snapshot', () => {
        const wrapper = shallow(getComponent({hubConnectionString: 'testString'}));
        expect(wrapper).toMatchSnapshot();
    });
});
