/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Button, Field, Input, InputOnChangeData } from '@fluentui/react-components';
import { EyeRegular, EyeOffRegular } from '@fluentui/react-icons';

export interface PasswordFieldProps {
    ariaLabel: string;
    label: string;
    value: string;
    readOnly?: boolean;
    required?: boolean;
    onChange?: (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void;
    errorMessage?: string;
    description?: string;
    revealPasswordAriaLabel?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = (props) => {
    const { ariaLabel, label, value, readOnly, required, onChange, errorMessage, description, revealPasswordAriaLabel } = props;
    const [revealed, setRevealed] = React.useState(false);

    const toggleReveal = () => setRevealed(!revealed);

    const revealButton = (
        <Button
            appearance="subtle"
            size="small"
            icon={revealed ? <EyeOffRegular /> : <EyeRegular />}
            onClick={toggleReveal}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            title={revealPasswordAriaLabel || undefined}
        />
    );

    return (
        <Field
            label={label}
            validationMessage={errorMessage || undefined}
            validationState={errorMessage ? 'error' : undefined}
            hint={description}
            required={required}
        >
            <Input
                aria-label={ariaLabel}
                value={value || ''}
                type={revealed ? 'text' : 'password'}
                readOnly={readOnly}
                onChange={onChange}
                contentAfter={revealButton}
            />
        </Field>
    );
};
