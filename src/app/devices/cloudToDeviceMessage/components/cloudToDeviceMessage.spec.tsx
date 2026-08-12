/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CloudToDeviceMessage } from './cloudToDeviceMessage';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/devices/detail/cloudToDeviceMessage/', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' })
}));

jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([
    undefined,
    jest.fn()
]);

jest.mock('../../../navigation/hooks/useBreadcrumbEntry', () => ({
    useBreadcrumbEntry: jest.fn()
}));

describe('CloudToDeviceMessage', () => {
    it('renders send message button', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        expect(screen.getByText('cloudToDeviceMessage.sendMessageButtonText')).toBeInTheDocument();
    });

    it('renders message body section', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        expect(screen.getByLabelText('cloudToDeviceMessage.body')).toBeInTheDocument();
    });

    it('renders add timestamp checkbox', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        expect(screen.getByLabelText('cloudToDeviceMessage.addTimestamp')).toBeInTheDocument();
    });

    it('renders properties section with add custom property button', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        expect(screen.getByText('cloudToDeviceMessage.properties.addCustomProperty')).toBeInTheDocument();
    });

    it('exposes the system property name as the key cell content for screen readers', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        fireEvent.click(screen.getByRole('button', {
            name: 'cloudToDeviceMessage.properties.addSystemProperty'
        }));
        fireEvent.click(screen.getByRole('menuitem', {
            name: 'cloudToDeviceMessage.properties.systemProperties.lockToken.displayName'
        }));

        // The cell must announce the property name, not the generic "Key" column label.
        const keyCell = screen.getAllByRole('gridcell').find(cell => cell.textContent === 'lockToken');
        expect(keyCell).toBeDefined();
    });

    it('keeps a system property selection after the property list rerenders', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        fireEvent.click(screen.getByRole('button', {
            name: 'cloudToDeviceMessage.properties.addSystemProperty'
        }));
        fireEvent.click(screen.getByRole('menuitem', {
            name: 'cloudToDeviceMessage.properties.systemProperties.ack.displayName'
        }));

        const ackDropdown = screen.getByRole('combobox');
        fireEvent.click(ackDropdown);
        fireEvent.click(screen.getByRole('option', {
            name: 'cloudToDeviceMessage.properties.systemProperties.ack.full'
        }));
        fireEvent.click(screen.getByRole('button', {
            name: 'cloudToDeviceMessage.properties.addCustomProperty'
        }));

        expect(screen.getByRole('combobox').textContent)
            .toContain('cloudToDeviceMessage.properties.systemProperties.ack.full');
    });
});
