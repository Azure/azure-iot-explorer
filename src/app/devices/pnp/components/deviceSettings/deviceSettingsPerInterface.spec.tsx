/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceSettingsPerInterface, DeviceSettingDataProps, DeviceSettingDispatchProps } from './deviceSettingsPerInterface';
import { DeviceSettingsPerInterfacePerSetting } from './deviceSettingsPerInterfacePerSetting';
import { generateTwinSchemaAndInterfaceTuple } from './dataHelper';
import { testModelDefinition, testTwin, testComponentName } from './testData';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

jest.mock('../../context/pnpStateContext', () => ({
    usePnpStateContext: () => ({
        pnpState: {
            twin: { payload: null, synchronizationStatus: 'initialized' },
            modelDefinitionWithSource: { payload: null, synchronizationStatus: 'initialized' }
        },
        dispatch: jest.fn(),
        getModelDefinition: jest.fn()
    })
}));

describe('components/devices/deviceSettingsPerInterface', () => {
    it('renders without crashing', () => {
        const props = {
            deviceId: 'testDevice',
            moduleId: '',
            interfaceId: 'testInterface',
            twinWithSchema: [],
            patchTwin: jest.fn()
        };
        const { container } = render(<MemoryRouter><DeviceSettingsPerInterface {...props as any}/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
