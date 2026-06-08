/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DirectMethod } from './directMethod';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/devices/detail/directMethod/', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' })
}));

jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([
    undefined,
    jest.fn()
]);

jest.mock('../../../navigation/hooks/useBreadcrumbEntry', () => ({
    useBreadcrumbEntry: jest.fn()
}));

describe('DirectMethod', () => {
    it('renders invoke method button', () => {
        render(<MemoryRouter><DirectMethod/></MemoryRouter>);

        expect(screen.getByText('directMethod.invokeMethodButtonText')).toBeInTheDocument();
    });

    it('renders method name input field', () => {
        render(<MemoryRouter><DirectMethod/></MemoryRouter>);

        expect(screen.getByText('directMethod.methodName')).toBeInTheDocument();
    });

    it('renders payload section', () => {
        render(<MemoryRouter><DirectMethod/></MemoryRouter>);

        expect(screen.getByText('directMethod.payload')).toBeInTheDocument();
    });

    it('renders timeout sliders', () => {
        render(<MemoryRouter><DirectMethod/></MemoryRouter>);

        expect(screen.getByLabelText('directMethod.connectionTimeout')).toBeInTheDocument();
        expect(screen.getByLabelText('directMethod.responseTimeout')).toBeInTheDocument();
    });
});
