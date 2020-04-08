import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ConnectionStringsViewContainer } from '../../connectionStrings/components/connectionStringsViewContainer';

export const AzureResourcesContainer: React.FC<RouteComponentProps> = props => {
       return <ConnectionStringsViewContainer {...props} />;
};
