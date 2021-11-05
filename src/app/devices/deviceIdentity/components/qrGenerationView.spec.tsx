/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import * as React from 'react';
 import { shallow } from 'enzyme';
 import { QrGenerationView } from './qrGenerationView';

 describe('DeviceModules', () => {
     it('matches snapshot', () => {
         expect(shallow(
             <QrGenerationView
                deviceId="some_device"
                deviceKey="invalid_device_key"
                hostName="invalid_host"
             />
         )).toMatchSnapshot();
     });
 });
