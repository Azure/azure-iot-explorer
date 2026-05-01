/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { CloseButton } from './notificationToast';

describe('shared/components/CloseButton', () => {
    it('renders button with aria-label', () => {
        render(<CloseButton/>);
        expect(screen.getByLabelText('common.close')).toBeDefined();
    });
});
