/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceSettingsPerInterfacePerSetting } from './deviceSettingsPerInterfacePerSetting';

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

const defaultProps = {
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

describe('deviceSettingsPerInterfacePerSetting', () => {
    it('renders the setting item', () => {
        const { container } = render(<MemoryRouter><DeviceSettingsPerInterfacePerSetting {...defaultProps as any}/></MemoryRouter>);

        // Component renders an article-like list item structure
        expect(container.firstChild).toBeDefined();
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('renders collapse toggle button with title', () => {
        render(<MemoryRouter><DeviceSettingsPerInterfacePerSetting {...defaultProps as any}/></MemoryRouter>);

        // When not collapsed, button title should be "collapse"
        const collapseButton = screen.getByTitle('deviceSettings.command.collapse');
        expect(collapseButton).toBeDefined();
    });

    it('renders dialog element for reported value panel', () => {
        render(<MemoryRouter><DeviceSettingsPerInterfacePerSetting {...defaultProps as any}/></MemoryRouter>);

        expect(screen.getByRole('dialog')).toBeDefined();
    });
});
