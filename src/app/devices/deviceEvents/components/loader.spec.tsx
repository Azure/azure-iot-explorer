/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Loader } from './loader';

import { render, screen } from '@testing-library/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
describe('Loader', () => {
    it('matches snapshot when loading', () => {
        expect(render(<Loader monitoringData={true}/>)).toBeDefined();
    });

    it('matches snapshot when not loading', () => {
        expect(render(<Loader monitoringData={false}/>)).toBeDefined();
    });

    it('keeps the live region mounted before the status message appears', () => {
        const { rerender } = render(<Loader monitoringData={false}/>);

        const liveRegion = screen.getByRole('status');
        expect(liveRegion).toHaveAttribute('aria-live', 'polite');
        expect(liveRegion.textContent).toEqual('');

        rerender(<Loader monitoringData={true}/>);

        expect(screen.getByRole('status')).toBe(liveRegion);
        expect(liveRegion.textContent).toContain(ResourceKeys.deviceEvents.infiniteScroll.loading);
    });
});