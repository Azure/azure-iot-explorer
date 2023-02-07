import * as React from 'react';
import { CONNECTION_STRING_NAME_LIST } from '../../../constants/browserStorage';
import { getConnectionInfoFromConnectionString } from '../../../api/shared/utils';
import { getActiveConnectionString } from '../../../shared/utils/hubConnectionStringHelper';

interface LocalStorageInformation {
    hubConnectionString: string;
    hostName: string;
}

export const getHubInformationFromLocalStorage = (): LocalStorageInformation => {
    const [ hubConnectionString, setHubConnectionString ] = React.useState<string>('');
    const [ hostName, setHostName ] = React.useState<string>('');
    const connectionStrings = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    const connectionString = getActiveConnectionString(connectionStrings);

    React.useEffect(() => {
        setHubConnectionString(connectionString);
        setHostName(getConnectionInfoFromConnectionString(connectionString).hostName);
    },              [connectionString]);

    return {hubConnectionString, hostName};
};
