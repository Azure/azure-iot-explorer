/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { DeviceListQuery, DeviceListQueryProps } from './deviceListQuery';
import { DeviceQueryClause } from './deviceQueryClause';


describe('DeviceListQuery', () => {
    it('renders without crashing', () => {
        const { container } = render(<DeviceListQuery/>);
        expect(container).toBeDefined();
    });
});
