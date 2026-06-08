/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPane } from './settingsPane';

describe('settingsPane', () => {
    it('renders settings launch button', () => {
        render(<SettingsPane/>);

        expect(screen.getByText('header.settings.launch')).toBeInTheDocument();
    });

    it('settings button has aria-label', () => {
        render(<SettingsPane/>);

        expect(screen.getByLabelText('header.settings.launch')).toBeInTheDocument();
    });
});
