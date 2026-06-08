/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
let useStateMock: jest.Mock | null = null;
jest.mock('react', () => {
    const actual = jest.requireActual('react');
    return {
        ...actual,
        useState: (...args: any[]) => {
            if (useStateMock) {
                const result = useStateMock(...args);
                if (result !== undefined) {
                    return result;
                }
            }
            return actual.useState(...args);
        },
    };
});

import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { DevicePropertiesPerInterface, DevicePropertiesDataProps } from './devicePropertiesPerInterface';

describe('devicePropertiesPerInterface', () => {

    afterEach(() => {
        useStateMock = null;
    });

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
        expect(render(getComponent())).toBeDefined();
    });

    it('shows overlay', () => {
        const actual = jest.requireActual('react');
        let called = false;
        useStateMock = jest.fn((...args: any[]) => {
            if (!called) {
                called = true;
                return actual.useState(true);
            }
            return undefined;
        });
        const wrapperWithOverlay = render(getComponent());
    });
});