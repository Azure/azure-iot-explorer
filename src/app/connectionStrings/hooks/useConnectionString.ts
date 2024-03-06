import { useState } from 'react';
import { ConnectionStringType } from '../context/connectionStringContext';

export const useConnectionString = (): ConnectionStringType => {
    const [connectionString, setConnectionString] = useState<string>('');
    return [{connectionString}, {setConnectionString}];
};
