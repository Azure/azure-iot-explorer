/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { LabelWithRichCallout } from './labelWithRichCallout';

describe('components/shared/labelWithRichCallout', () => {

    it('renders label text with info button', () => {
        render(
            <LabelWithRichCallout
                calloutContent={<></>}
            >
                {'labelText'}
            </LabelWithRichCallout>
        );
        expect(screen.getByText('labelText')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'More information' })).toBeInTheDocument();
    });
});
