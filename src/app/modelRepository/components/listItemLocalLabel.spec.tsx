/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { ListItemLocalLabel } from './listItemLocalLabel';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';


describe('ListItemLocalLabel', () => {
    it('renders without crashing', () => {
        const { container } = render(<ListItemLocalLabel/>);
        expect(container).toBeDefined();
    });
});
