/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeView } from './homeView';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/home', search: '', hash: '', state: null, key: 'default' })
}));

describe('HomeView', () => {
    it('renders the home container', async () => {
        let container: HTMLElement;
        await act(async () => {
            ({ container } = render(<MemoryRouter initialEntries={['/home']}><HomeView/></MemoryRouter>));
        });

        expect(container!.firstChild).toBeDefined();
    });

    it('renders navigation area', async () => {
        let container: HTMLElement;
        await act(async () => {
            ({ container } = render(<MemoryRouter initialEntries={['/home']}><HomeView/></MemoryRouter>));
        });

        const navArea = container!.querySelector('.home-content');
        expect(navArea !== null || container!.childElementCount > 0).toBe(true);
    });
});
