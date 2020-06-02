/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { DevicePropertiesPerInterface, DevicePropertiesDataProps, DevicePropertiesState } from './devicePropertiesPerInterface';
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
        expect(shallow(getComponent())).toMatchSnapshot();
    });

    it('shows overlay', () => {
        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(true));
        const wrapperWithOverlay = mount(getComponent());
        expect(wrapperWithOverlay.find(Overlay)).toBeDefined();
    });
});
