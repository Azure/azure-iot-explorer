/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    initialRoute?: string;
}

export function renderWithRouter(
    ui: React.ReactElement,
    { initialRoute = '/', ...renderOptions }: CustomRenderOptions = {}
) {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <MemoryRouter initialEntries={[initialRoute]}>
            {children}
        </MemoryRouter>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from RTL for convenience
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
