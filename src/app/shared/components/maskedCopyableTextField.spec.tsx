/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MaskedCopyableTextField } from './maskedCopyableTextField';

describe('MaskedCopyableTextField', () => {
    describe('rendering', () => {
        it('renders when allowMask = false', () => {
            render(
                <MaskedCopyableTextField
                    allowMask={false}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                />
            );
            expect(screen.getByLabelText('ariaLabel1')).toBeInTheDocument();
        });

        it('renders when allowMask = true', () => {
            render(
                <MaskedCopyableTextField
                    allowMask={true}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                />
            );
            expect(screen.getByLabelText('ariaLabel1')).toBeInTheDocument();
        });
    });

    describe('toggleDisplay', () => {
        it('toggles display on button click', () => {
            render(
                <MaskedCopyableTextField
                    allowMask={true}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                />
            );

            const showButton = screen.getByLabelText('common.maskedCopyableTextField.toggleMask.label.show');
            fireEvent.click(showButton);
            expect(screen.getByLabelText('common.maskedCopyableTextField.toggleMask.label.hide')).toBeInTheDocument();
        });
    });

    describe('copyToClipboard', () => {
        it('executes copyToClipboard', () => {
            render(
                <MaskedCopyableTextField
                    allowMask={false}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                />
            );

            const clipboardButton = screen.getByLabelText('common.maskedCopyableTextField.copy.label');
            fireEvent.click(clipboardButton);
            expect(document.execCommand).toHaveBeenLastCalledWith('copy');
        });
    });
});
