/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { DeviceIdentityInformation } from './deviceIdentity';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as IotHubContext from '../../../iotHub/hooks/useIotHubContext';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';


describe('deviceIdentity', () => {
    it('renders without crashing', () => {
        const { container } = render(<DeviceIdentityInformation/>);
        expect(container).toBeDefined();
    });
});
