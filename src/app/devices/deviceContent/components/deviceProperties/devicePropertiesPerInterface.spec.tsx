/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DevicePropertiesPerInterface, { DevicePropertiesDataProps } from './devicePropertiesPerInterface';
import { testSnapshot } from '../../../../shared/utils/testHelpers';
import { twinWithSchema } from '../deviceSettings/deviceSettings.spec';

describe('devicePropertiesPerInterface', () => {

    const deviceSettingsProps: DevicePropertiesDataProps = {
        twinAndSchema: [{
            propertyModelDefinition: twinWithSchema.settingModelDefinition,
            propertySchema: twinWithSchema.settingSchema,
            reportedTwin: twinWithSchema.reportedTwin,
        }]
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceSettingsProps,
            ...overrides
        };

        return <DevicePropertiesPerInterface {...props} />;
    };

    it('matches snapshot', () => {
        testSnapshot(getComponent());
    });
});
