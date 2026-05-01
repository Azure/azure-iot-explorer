/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { SettingsPane } from './settingsPane';


describe('settingsPane', () => {
    it('renders without crashing', () => {
        const { container } = render(<SettingsPane/>);
        expect(container).toBeDefined();
    });
});
