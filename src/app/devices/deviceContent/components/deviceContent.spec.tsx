/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DeviceContentComponent, DeviceContentDispatchProps, DeviceContentDataProps } from './deviceContent';

const pathname = '/#/devices/detail/?id=testDevice';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?id=testDevice' }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('deviceContent', () => {
    const deviceContentDataProps: DeviceContentDataProps = {
        digitalTwinModelId: 'dtmi:__azureiot:samplemodel;1',
        identityWrapper: null,
        isLoading: false,
    };

    const deviceContentDispatchProps: DeviceContentDispatchProps = {
        getDeviceIdentity: jest.fn(),
        getDigitalTwin: jest.fn(),
        setComponentName: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceContentDataProps,
            ...deviceContentDispatchProps,
            ...overrides
        };

        return (
            <DeviceContentComponent {...props} />
        );
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });
});
