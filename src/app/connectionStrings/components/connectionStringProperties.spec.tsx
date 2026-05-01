/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ConnectionStringProperties, ConnectionStringPropertiesProps } from './connectionStringProperties';

import { render } from '@testing-library/react';
describe('ConnectionSTringProperties', () => {
    it('matches snapshot', () => {
        const props: ConnectionStringPropertiesProps = {
            connectionString: 'connectionString',
            hostName: 'hostName',
            sharedAccessKey: 'sharedAccessKey',
            sharedAccessKeyName: 'sharedAccessKeyName'
        };

        const { container } = render(<ConnectionStringProperties {...props}/>);
        expect(container).toBeDefined();
    });
});
