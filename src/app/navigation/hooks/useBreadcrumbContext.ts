/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { BreadcrumbEntry } from '../model';

export interface BreadcrumbContextType {
    stack: BreadcrumbEntry[];
    registerEntry(entry: BreadcrumbEntry): void;
    unregisterEntry(entry: BreadcrumbEntry): void;
}

export const BreadcrumbContext = React.createContext<BreadcrumbContextType>({
    registerEntry: () => {}, // tslint:disable-line: no-empty
    stack: [],
    unregisterEntry: () => {} // tslint:disable-line: no-empty
});
export const useBreadcrumbContext = () => React.useContext<BreadcrumbContextType>(BreadcrumbContext);
