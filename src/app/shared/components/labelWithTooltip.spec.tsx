/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { LabelWithTooltip } from './labelWithTooltip';

describe('components/shared/labelWithTooltip', () => {

    it('renders label text when tooltip specified', () => {
        render(
            <LabelWithTooltip
                tooltipText="calloutText"
            >
                {'labelText'}
            </LabelWithTooltip>
        );
        expect(screen.getByText('labelText')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'More information' })).toBeInTheDocument();
    });

    it('renders label text when no tooltip specified', () => {
        render(
            <LabelWithTooltip>
                {'labelText'}
            </LabelWithTooltip>
        );
        expect(screen.getByText('labelText')).toBeInTheDocument();
    });
});
