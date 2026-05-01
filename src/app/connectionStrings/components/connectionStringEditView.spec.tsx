/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { ConnectionStringEditView, ConnectionStringEditViewProps } from './connectionStringEditView';


describe('ConnectionStringEdit', () => {
    it('renders without crashing', () => {
        const { container } = render(<ConnectionStringEditView/>);
        expect(container).toBeDefined();
    });
});
