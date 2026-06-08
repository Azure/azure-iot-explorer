/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MultiLineShimmer } from './multiLineShimmer';

describe('shared/components/multiLineShimmer', () => {
    it('renders default shimmer lines', () => {
        const { container } = render(<MultiLineShimmer/>);
        const shimmerDiv = container.querySelector('.fixed-shimmer');
        expect(shimmerDiv).toBeInTheDocument();
        // Default renders 3 skeleton lines
        expect(shimmerDiv!.children.length).toBe(3);
    });

    it('renders custom shimmer count', () => {
        const shimmerCount = 10;
        const { container } = render(<MultiLineShimmer className="non-fixed-shimmer" shimmerCount={shimmerCount}/>);
        const shimmerDiv = container.querySelector('.non-fixed-shimmer');
        expect(shimmerDiv!.children.length).toBe(shimmerCount);
    });
});
