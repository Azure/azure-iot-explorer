/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { BreadcrumbEntry } from '../model';
import { BreadcrumbContextType } from './useBreadcrumbContext';

export const useBreadcrumbs = (): BreadcrumbContextType => {
    const [stack, setStack] = React.useState<BreadcrumbEntry[]>([]);

    const registerEntry = React.useCallback((entry: BreadcrumbEntry) => {
        setStack(currentState => {
            const newStack = [...currentState.filter(s => entry.path !== s.path), entry];
            const sortedStack = newStack.sort((a, b) => a.path.length - b.path.length);

            return sortedStack;
        });
    }, []); // tslint:disable-line: align

    const unregisterEntry = React.useCallback((entry: BreadcrumbEntry) => {
        setStack(currentState => {
            const newStack = currentState.filter(s => entry.path !== s.path);
            return newStack;
        });
    }, []); // tslint:disable-line: align

    return {stack, registerEntry, unregisterEntry};
};
