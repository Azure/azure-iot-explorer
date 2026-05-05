/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectionStringProperties, ConnectionStringPropertiesProps } from './connectionStringProperties';

describe('ConnectionStringProperties', () => {
    const defaultProps: ConnectionStringPropertiesProps = {
        connectionString: 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=abc123',
        hostName: 'test.azure-devices.net',
        sharedAccessKey: 'abc123',
        sharedAccessKeyName: 'iothubowner'
    };

    it('renders three MaskedCopyableTextField labels', () => {
        render(<ConnectionStringProperties {...defaultProps}/>);

        expect(screen.getByText('connectionStrings.properties.hostName.label')).toBeInTheDocument();
        expect(screen.getByText('connectionStrings.properties.sharedAccessPolicyName.label')).toBeInTheDocument();
        expect(screen.getByText('connectionStrings.properties.sharedAccessPolicyKey.label')).toBeInTheDocument();
    });

    it('renders host name and policy name fields with correct aria labels', () => {
        render(<ConnectionStringProperties {...defaultProps}/>);

        expect(screen.getByLabelText('connectionStrings.properties.hostName.ariaLabel')).toBeInTheDocument();
        expect(screen.getByLabelText('connectionStrings.properties.sharedAccessPolicyName.ariaLabel')).toBeInTheDocument();
        expect(screen.getByLabelText('connectionStrings.properties.sharedAccessPolicyKey.ariaLabel')).toBeInTheDocument();
    });
});
