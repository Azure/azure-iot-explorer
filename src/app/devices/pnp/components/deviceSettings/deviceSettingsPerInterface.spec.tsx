/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceSettingsPerInterface } from './deviceSettingsPerInterface';
import { TwinWithSchema } from './dataHelper';
import { DataFormActionProps, DataFormDataProps } from '../../../shared/components/dataForm';

jest.mock('../../../shared/components/dataForm', () => ({
    ...jest.requireActual('../../../shared/components/dataForm'),
    DataForm: (props: DataFormDataProps & DataFormActionProps) => (
        <form aria-label={props.settingSchema.title}>
            <output>{JSON.stringify(props.formData)}</output>
            <button type="button" onClick={props.handleSave(props.formData)}>Save</button>
        </form>
    )
}));

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
    const defaultProps = {
        deviceId: 'testDevice',
        moduleId: '',
        interfaceId: 'testInterface',
        componentName: 'R0',
        twinWithSchema: [],
        patchTwin: jest.fn()
    };

    it('renders the settings list container', () => {
        const { container } = render(<MemoryRouter><DeviceSettingsPerInterface {...defaultProps as any}/></MemoryRouter>);

        expect(container.querySelector('.pnp-detail-list')).toBeInTheDocument();
    });

    it('renders with empty twinWithSchema', () => {
        const { container } = render(<MemoryRouter><DeviceSettingsPerInterface {...defaultProps as any}/></MemoryRouter>);

        expect(container).toBeDefined();
    });

    const settings: TwinWithSchema[] = ['network', 'reader', 'antennas'].map((name, index) => ({
        settingModelDefinition: {
            '@type': 'Property',
            name,
            schema: { '@type': 'Object', fields: [{ name: 'level', schema: 'integer' }] },
            writable: true
        },
        settingSchema: { title: name, type: 'object', properties: { level: { type: 'integer' } } },
        desiredValue: { level: index },
        reportedSection: { value: { level: index + 10 } }
    }));

    it('renders only the corresponding editor in each desired-value cell, including after rerender', () => {
        const props = { ...defaultProps, twinWithSchema: settings };
        const { rerender } = render(<DeviceSettingsPerInterface {...props} />);

        const checkEditors = () => {
            expect(screen.getAllByRole('form')).toHaveLength(settings.length);
            settings.forEach(setting => {
                const name = setting.settingModelDefinition.name;
                const editor = screen.getByRole('form', { name });
                const row = editor.closest('[role="row"]') as HTMLElement;
                expect(within(row).getAllByRole('form')).toHaveLength(1);
                expect(within(editor).getByText(JSON.stringify(setting.desiredValue))).toBeInTheDocument();
            });
        };

        checkEditors();
        rerender(<DeviceSettingsPerInterface {...props} twinWithSchema={[...settings]} />);
        checkEditors();
    });

    it('patches only the selected property on the selected component', () => {
        const patchTwin = jest.fn();
        render(<DeviceSettingsPerInterface {...defaultProps} twinWithSchema={settings} patchTwin={patchTwin} />);

        fireEvent.click(within(screen.getByRole('form', { name: 'reader' })).getByRole('button', { name: 'Save' }));

        expect(patchTwin).toHaveBeenCalledTimes(1);
        expect(patchTwin).toHaveBeenCalledWith({
            deviceId: 'testDevice',
            moduleId: '',
            properties: { desired: { R0: { __t: 'c', reader: { level: 1 } } } }
        });
    });

    it('collapses one editor without collapsing the other settings', () => {
        render(<DeviceSettingsPerInterface {...defaultProps} twinWithSchema={settings} />);
        const row = screen.getByRole('form', { name: 'reader' }).closest('[role="row"]') as HTMLElement;

        fireEvent.click(within(row).getByTitle('deviceSettings.command.collapse'));

        expect(screen.queryByRole('form', { name: 'reader' })).not.toBeInTheDocument();
        expect(screen.getByRole('form', { name: 'network' })).toBeInTheDocument();
        expect(screen.getByRole('form', { name: 'antennas' })).toBeInTheDocument();

        fireEvent.click(within(row).getByTitle('deviceSettings.command.expand'));
        expect(screen.getByRole('form', { name: 'reader' })).toBeInTheDocument();
    });


    it.each([false, 0, ''])('preserves the desired value %p in its editor', value => {
        const type = typeof value === 'number' ? 'integer' : typeof value;
        const setting: TwinWithSchema = {
            settingModelDefinition: { '@type': 'Property', name: 'scalar', schema: type, writable: true },
            settingSchema: { title: 'scalar', type },
            desiredValue: value,
            reportedSection: { value: 'reported fallback' }
        };
        render(<DeviceSettingsPerInterface {...defaultProps} twinWithSchema={[setting]} />);
        expect(within(screen.getByRole('form', { name: 'scalar' })).getByText(JSON.stringify(value))).toBeInTheDocument();
    });

});
