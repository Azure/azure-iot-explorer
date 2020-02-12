/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';
import { DigitalTwinInterfaces } from './digitalTwinInterfaces';
import { ResourceKeys } from '../../../../../localization/resourceKeys';

describe('login/components/connectivityPane', () => {
    const routerProps: any = { // tslint:disable-line:no-any
        history: {
            location,
            push: jest.fn()
        },
        location,
        match: {
            url: 'resources/TestHub.azure-devices.net/devices/deviceDetail/digitalTwins/'
        }
    };

    const digitalTwinInterfacesDataProps =
    {
        dcm: 'dcmId',
        isLoading: false,
        nameToIds: {
            environmentSensor: 'urn:contoso:com:EnvironmentalSensor:1',
            urn_azureiot_ModelDiscovery_DigitalTwin: 'urn:azureiot:ModelDiscovery:DigitalTwin:1'
        },
        refresh: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...digitalTwinInterfacesDataProps,
            ...routerProps,
            ...overrides
        };

        return (
            <DigitalTwinInterfaces {...props} />
        );
    };

    it('shows dcm and interfaces', () => {
        const labels = mountWithLocalization(getComponent(), false, true).find(DigitalTwinInterfaces).find(Label);

        expect(labels).toHaveLength(3); // tslint:disable-line:no-magic-numbers
        expect(labels.first().props().children).toEqual(ResourceKeys.digitalTwin.dcm);
        expect(labels.at(1).props().children).toEqual('urn:contoso:com:EnvironmentalSensor:1');
        expect(labels.at(2).props().children).toEqual('urn:azureiot:ModelDiscovery:DigitalTwin:1'); // tslint:disable-line:no-magic-numbers
    });
});
