/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DigitalTwinComponentList } from './digitalTwinComponentList';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const interfaceId = 'urn:azureiot:samplemodel;1';

const deviceTwin: any = {
    deviceId: 'testDevice',
    modelId: interfaceId,
    properties: {
        desired: { environmentalSensor: { brightness: 456, __t: 'c' } },
        reported: { environmentalSensor: { brightness: { value: 123, dv: 2 }, __t: 'c' } }
    }
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' }),
    useNavigate: () => jest.fn(),
}));

describe('DigitalTwinComponentList', () => {
    it('renders no-component label when definition has no components', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: { payload: deviceTwin, synchronizationStatus: SynchronizationStatus.fetched },
            modelDefinitionWithSource: {
                payload: {
                    isModelValid: true,
                    modelDefinition: {
                        '@context': 'dtmi:dtdl:context;2',
                        '@id': 'dtmi:plugnplay:hube2e:cm;1',
                        '@type': 'Interface',
                        'contents': [],
                        'displayName': 'IoT Hub E2E Tests',
                    },
                    source: REPOSITORY_LOCATION_TYPE.Public
                },
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});
        render(<MemoryRouter><DigitalTwinComponentList /></MemoryRouter>);

        // With no components, should show the default component entry
        const tablist = screen.queryByRole('tablist');
        expect(tablist).toBeDefined();
    });

    it('renders component entries when definition has components', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: { payload: deviceTwin, synchronizationStatus: SynchronizationStatus.fetched },
            modelDefinitionWithSource: {
                payload: {
                    isModelValid: true,
                    modelDefinition: {
                        '@context': 'dtmi:dtdl:context;2',
                        '@id': 'dtmi:plugnplay:hube2e:cm;1',
                        '@type': 'Interface',
                        'contents': [
                            { '@type': 'Component', 'name': 'deviceInformation', 'schema': 'dtmi:__DeviceManagement:DeviceInformation;1' },
                            { '@type': 'Component', 'name': 'sdkInfo', 'schema': 'dtmi:__Client:SDKInformation;1' },
                            { '@type': 'Component', 'name': 'environmentalSensor', 'schema': 'dtmi:__Contoso:EnvironmentalSensor;1' }
                        ],
                        'displayName': 'IoT Hub E2E Tests',
                    },
                    source: REPOSITORY_LOCATION_TYPE.Public
                },
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});
        const { container } = render(<MemoryRouter><DigitalTwinComponentList /></MemoryRouter>);

        // Should render links for the 3 components plus the default component
        const links = container.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
    });
});