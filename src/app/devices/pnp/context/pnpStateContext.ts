/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { pnpStateInitial, PnpStateInterface } from '../state';

// tslint:disable-next-line: no-any
const PnpStateContext = React.createContext<{pnpState: PnpStateInterface, dispatch?: (action: any) => void, getModelDefinition?: () => void}>({ pnpState: pnpStateInitial()});
export const PnpStateContextProvider = PnpStateContext.Provider;
export const usePnpStateContext = () => React.useContext(PnpStateContext);
