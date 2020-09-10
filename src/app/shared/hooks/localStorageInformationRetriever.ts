import * as React from 'react';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';

export const getHubInformationFromLocalStorage = () => {
    const [ hubConnectionString, setHubConnectionString ] = React.useState<string>('');
    const [ hostName, setHostName ] = React.useState<string>('');
    const connectionStrings = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    const connectionString = connectionStrings && connectionStrings.split(',')[0];
    React.useEffect(() => {
        setHubConnectionString(connectionString);
        setHostName(getConnectionInfoFromConnectionString(connectionString).hostName);
    },              [connectionString]);
    return [hubConnectionString, hostName];
};
