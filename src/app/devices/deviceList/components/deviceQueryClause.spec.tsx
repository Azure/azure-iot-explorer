/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeviceQueryClause, DeviceQueryClauseProps } from './deviceQueryClause';
import { ParameterType } from '../../../api/models/deviceQuery';

describe('DeviceQueryClause', () => {
    const defaultProps: DeviceQueryClauseProps = {
        index: 0,
        operation: undefined,
        parameterType: undefined,
        value: '',
        isError: true,
        removeClause: jest.fn(),
        setClause: jest.fn()
    };

    it('renders parameter type dropdown', () => {
        render(<DeviceQueryClause {...defaultProps}/>);

        expect(screen.getByLabelText(
            'deviceLists.query.searchPills.clause.parameterType.ariaLabel'
        )).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders remove button', () => {
        render(<DeviceQueryClause {...defaultProps}/>);

        expect(screen.getByLabelText('deviceLists.query.searchPills.clause.remove.ariaLabel')).toBeInTheDocument();
    });

    it('calls removeClause when remove button is clicked', () => {
        const removeClause = jest.fn();
        render(<DeviceQueryClause {...defaultProps} removeClause={removeClause}/>);

        fireEvent.click(screen.getByLabelText('deviceLists.query.searchPills.clause.remove.ariaLabel'));
        expect(removeClause).toHaveBeenCalledWith(0);
    });

    it('displays selected parameter and value after a prop-driven rerender', () => {
        const { rerender } = render(<DeviceQueryClause {...defaultProps}/>);

        rerender(<DeviceQueryClause
            {...defaultProps}
            parameterType={ParameterType.status}
            value="enabled"
        />);

        const parameterDropdown = screen.getByLabelText(
            'deviceLists.query.searchPills.clause.parameterType.ariaLabel'
        );
        const valueDropdown = screen.getByLabelText(
            'deviceLists.query.searchPills.clause.value.ariaLabel'
        );

        expect(parameterDropdown).toHaveAttribute('aria-invalid', 'false');
        expect(parameterDropdown.textContent).toContain(
            'deviceLists.query.searchPills.clause.parameterType.items.status'
        );
        expect(valueDropdown).toHaveAttribute('aria-invalid', 'false');
        expect(valueDropdown.textContent).toContain(
            'deviceLists.query.searchPills.clause.value.deviceStatus.enabled'
        );
    });

    it('marks the value dropdown invalid when it has no selection', () => {
        render(<DeviceQueryClause
            {...defaultProps}
            parameterType={ParameterType.status}
        />);

        expect(screen.getByLabelText(
            'deviceLists.query.searchPills.clause.value.ariaLabel'
        )).toHaveAttribute('aria-invalid', 'true');
    });
});
