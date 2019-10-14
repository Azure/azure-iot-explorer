/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import DevicePropertiesPerInterface, { DevicePropertiesDataProps, DevicePropertiesState } from './devicePropertiesPerInterface';
import { testSnapshot, mountWithLocalization } from '../../../../shared/utils/testHelpers';
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

    it('shows overlay', () => {
        const wrapper = mountWithLocalization(getComponent());
        expect((wrapper.state() as DevicePropertiesState).showOverlay).toBeFalsy();
        wrapper.setState({showOverlay: true});
        wrapper.update();
        expect(wrapper.find(Overlay)).toBeDefined();
    });
});
