/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react';
import DeviceEventsPerInterfaceComponent, { DeviceEventsDataProps, DeviceEventsDispatchProps, TelemetrySchema } from './deviceEventsPerInterface';
import { mountWithLocalization, testWithLocalizationContext } from '../../../../shared/utils/testHelpers';

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

    const deviceEventsDispatchProps: DeviceEventsDispatchProps = {
        refresh: jest.fn(),
        setInterfaceId: jest.fn()
    };

    const deviceEventsDataProps: DeviceEventsDataProps = {
        connectionString: 'testString',
        interfaceName: 'environmentalSensor',
        isLoading: true,
        telemetrySchema: []
    };

    const getComponent = (overrides = {}) => {
        const props = {
            connectionString: '',
            ...deviceEventsDispatchProps,
            ...deviceEventsDataProps,
            ...routerProps,
            ...overrides,
        };
        return <DeviceEventsPerInterfaceComponent {...props} />;
    };

    it('matches snapshot while state is loading', () => {
        const wrapper = mountWithLocalization(getComponent());
        expect(wrapper.find(Shimmer)).toMatchSnapshot();
    });

    it('matches snapshot while state is loading', () => {
        const telemetrySchema: TelemetrySchema[] = [{
            parsedSchema: {
                description: 'Temperature /Current temperature on the device',
                title: 'temp',
                type: 'number'
            },
            telemetryModelDefinition: {
                '@type': 'Telemetry',
                'description': 'Current temperature on the device',
                'displayName': 'Temperature',
                'name': 'temp',
                'schema': 'double'
            }
        }];
        const wrapper = testWithLocalizationContext(getComponent({isLoading: false, telemetrySchema}));
        expect(wrapper).toMatchSnapshot();
    });
});
