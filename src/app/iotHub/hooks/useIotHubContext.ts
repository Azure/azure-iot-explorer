/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IotHubProperties } from '../model';

// future proofing a bit -- the type will expand once auth features come in.
export type IotHubContextType = IotHubProperties;

export const IotHubContext = React.createContext<IotHubContextType>({
    hostName: ''
});

export const useIotHubContext = () => React.useContext<IotHubContextType>(IotHubContext);
