/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { GlobalStateInterface, globalStateInitial } from '../global/state';

// tslint:disable-next-line: no-any
const GlobalStateContext = React.createContext<{globalState: GlobalStateInterface, dispatch?: (action: any) => void}>({ globalState: globalStateInitial() });
export const GlobalStateProvider = GlobalStateContext.Provider;
export const useGlobalStateContext = () => React.useContext(GlobalStateContext);
