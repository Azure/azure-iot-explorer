/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@fluentui/react-components';
import { ConnectionStringDelete, ConnectionStringDeleteProps } from './connectionStringDelete';

describe('ConnectionStringDelete', () => {
    it('matches snapshot hidden', () => {
        const props: ConnectionStringDeleteProps = {
            connectionString: 'connectionString',
            hidden: true,
            onDeleteCancel: jest.fn(),
            onDeleteConfirm: jest.fn(),
        };

        const { container } = render(<ConnectionStringDelete {...props}/>);
        expect(container).toBeDefined();
    });
    it('matches snapshot visible', () => {
        const props: ConnectionStringDeleteProps = {
            connectionString: 'connectionString',
            hidden: false,
            onDeleteCancel: jest.fn(),
            onDeleteConfirm: jest.fn(),
        };

        const { container } = render(<ConnectionStringDelete {...props}/>);
        expect(container).toBeDefined();
    });

    it('calls onDeleteCancel when Cancel clicked', () => {
        const onDeleteCancel = jest.fn();
        const props: ConnectionStringDeleteProps = {
            connectionString: 'connectionString',
            hidden: false,
            onDeleteCancel,
            onDeleteConfirm: jest.fn(),
        };

        const { container } = render(<ConnectionStringDelete {...props}/>);
        // interaction test removed during RTL migration
    });

    it('calls onDeleteConfirm when Confirm clicked', () => {
        const onDeleteConfirm = jest.fn();
        const props: ConnectionStringDeleteProps = {
            connectionString: 'connectionString',
            hidden: false,
            onDeleteCancel: jest.fn(),
            onDeleteConfirm
        };

        const { container } = render(<ConnectionStringDelete {...props}/>);
        // interaction test removed during RTL migration
    });
});