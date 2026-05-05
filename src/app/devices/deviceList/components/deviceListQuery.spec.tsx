/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DeviceListQuery, DeviceListQueryProps } from './deviceListQuery';

describe('DeviceListQuery', () => {
    const defaultProps: DeviceListQueryProps = {
        refresh: 0,
        setQueryAndExecute: jest.fn()
    };

    it('renders device ID search input', () => {
        render(<DeviceListQuery {...defaultProps}/>);

        expect(screen.getByLabelText('deviceLists.query.deviceId.ariaLabel')).toBeInTheDocument();
    });

    it('renders search button', () => {
        render(<DeviceListQuery {...defaultProps}/>);

        expect(screen.getByLabelText('deviceLists.query.deviceId.searchButton.ariaLabel')).toBeInTheDocument();
    });

    it('renders add filter pill button', () => {
        render(<DeviceListQuery {...defaultProps}/>);

        expect(screen.getByText('deviceLists.query.searchPills.add.text')).toBeInTheDocument();
    });
});
