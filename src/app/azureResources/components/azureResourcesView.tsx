/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ConnectionStringsViewContainer } from '../../connectionStrings/components/connectionStringsView';

export const AzureResourcesView: React.FC<RouteComponentProps> = props => {
       return <ConnectionStringsViewContainer {...props} />;
};
