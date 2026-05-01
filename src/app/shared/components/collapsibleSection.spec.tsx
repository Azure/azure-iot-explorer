/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleSection, CollapsibleSectionProps } from './collapsibleSection';

describe('collapsibleSection', () => {

    const getComponent = (overrides = {}) => {
        const props: CollapsibleSectionProps = {
            children: <></>,
            expanded: false,
            label: 'Label',
            tooltipText: 'tooltip',
            ...overrides
        };

        return <CollapsibleSection {...props} />;
    };

    it('renders with label', () => {
        render(getComponent());
        expect(screen.getByText('Label')).toBeDefined();
    });

    it('toggles section', () => {
        render(getComponent());
        const button = screen.getByTitle('collapsibleSection.open');
        expect(button).toBeDefined();

        fireEvent.click(button);
        expect(screen.getByTitle('collapsibleSection.close')).toBeDefined();
    });
});
