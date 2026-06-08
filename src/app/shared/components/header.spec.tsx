/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './header';

describe('Header', () => {
    it('renders application name', () => {
        render(<Header/>);

        expect(screen.getByText('header.applicationName')).toBeInTheDocument();
    });

    it('renders header element', () => {
        const { container } = render(<Header/>);

        expect(container.querySelector('header.header-container')).toBeInTheDocument();
    });

    it('renders settings button', () => {
        render(<Header/>);

        expect(screen.getByText('header.settings.launch')).toBeInTheDocument();
    });
});
