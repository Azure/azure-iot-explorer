/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Overlay } from '@fluentui/react';
import { DevicePropertiesPerInterface, DevicePropertiesDataProps } from './devicePropertiesPerInterface';

describe('devicePropertiesPerInterface', () => {

    /* tslint:disable */
    const deviceSettingsProps: DevicePropertiesDataProps = {
        twinAndSchema: [{
            propertyModelDefinition: {
                "@type": "Property",
                "displayName": "Current Temperature",
                "description": "Current temperature reported from the device.",
                "name": "currentTemperature",
                "schema": "double",
                "writable": false
                },
            propertySchema: {
                title: 'Current temperature reported from the device.',
                required: null,
                type: 'number'
            },
            reportedTwin: 12.5,
        }]
    };
    /* tslint:enable */

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceSettingsProps,
            ...overrides
        };

        return <DevicePropertiesPerInterface {...props} />;
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });

    it('shows overlay', () => {
        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(true));
        const wrapperWithOverlay = mount(getComponent());
        expect(wrapperWithOverlay.find(Overlay)).toBeDefined();
    });
});
