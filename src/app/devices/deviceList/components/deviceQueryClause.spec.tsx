/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { DeviceQueryClause } from './deviceQueryClause';
import { ParameterType, OperationType } from '../../../api/models/deviceQuery';


describe('DeviceQueryClause', () => {
    it('renders without crashing', () => {
        const { container } = render(<DeviceQueryClause/>);
        expect(container).toBeDefined();
    });
});
