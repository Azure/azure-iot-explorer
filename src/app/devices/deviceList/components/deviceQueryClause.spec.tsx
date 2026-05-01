/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeviceQueryClause, DeviceQueryClauseProps } from './deviceQueryClause';
import { ParameterType, OperationType } from '../../../api/models/deviceQuery';

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

        expect(screen.getByLabelText('deviceLists.query.searchPills.clause.parameterType.ariaLabel')).toBeDefined();
    });

    it('renders remove button', () => {
        render(<DeviceQueryClause {...defaultProps}/>);

        expect(screen.getByLabelText('deviceLists.query.searchPills.clause.remove.ariaLabel')).toBeDefined();
    });

    it('calls removeClause when remove button is clicked', () => {
        const removeClause = jest.fn();
        render(<DeviceQueryClause {...defaultProps} removeClause={removeClause}/>);

        fireEvent.click(screen.getByLabelText('deviceLists.query.searchPills.clause.remove.ariaLabel'));
        expect(removeClause).toHaveBeenCalledWith(0);
    });
});
