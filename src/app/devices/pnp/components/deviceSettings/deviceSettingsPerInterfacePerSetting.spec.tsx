/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceSettingsPerInterfacePerSetting, DeviceSettingDataProps, DeviceSettingDispatchProps } from './deviceSettingsPerInterfacePerSetting';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { DataForm } from '../../../shared/components/dataForm';
import { ResourceKeys } from '../../../../../localization/resourceKeys';

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

describe('deviceSettingsPerInterfacePerSetting', () => {
    it('renders without crashing', () => {
        const props = {
            settingModelDefinition: { name: 'testSetting', displayName: 'Test', schema: 'boolean' },
            settingSchema: { title: 'testSetting', type: 'boolean' },
            desiredValue: true,
            reportedSection: null,
            collapsed: false,
            deviceId: 'testDevice',
            moduleId: '',
            componentName: 'testComponent',
            interfaceId: 'testInterface',
            handleCollapseToggle: jest.fn(),
            handleOverlayDismiss: jest.fn(),
            patchTwin: jest.fn()
        };
        const { container } = render(<MemoryRouter><DeviceSettingsPerInterfacePerSetting {...props as any}/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
