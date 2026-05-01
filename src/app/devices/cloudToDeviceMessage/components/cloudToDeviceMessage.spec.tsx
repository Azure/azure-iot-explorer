/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
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

        expect(screen.getByText('cloudToDeviceMessage.sendMessageButtonText')).toBeDefined();
    });

    it('renders message body section', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        expect(screen.getByLabelText('cloudToDeviceMessage.body')).toBeDefined();
    });

    it('renders add timestamp checkbox', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        expect(screen.getByLabelText('cloudToDeviceMessage.addTimestamp')).toBeDefined();
    });

    it('renders properties section with add custom property button', () => {
        render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);

        expect(screen.getByText('cloudToDeviceMessage.properties.addCustomProperty')).toBeDefined();
    });
});
