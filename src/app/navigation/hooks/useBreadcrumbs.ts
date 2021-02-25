/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { BreadcrumbEntry } from '../model';

export interface UseBreadcrumbsResult {
    stack: BreadcrumbEntry[];
    registerEntry(entry: BreadcrumbEntry): void;
    unregisterEntry(entry: BreadcrumbEntry): void;
}

export const useBreadcrumbs = (): UseBreadcrumbsResult => {
    const [stack, setStack] = React.useState<BreadcrumbEntry[]>([]);

    const registerEntry = React.useCallback((entry: BreadcrumbEntry) => {
        // tslint:disable-next-line: no-console
        console.log('stacking' + JSON.stringify(entry));
        setStack(currentState => {
            const newStack = [...currentState.filter(s => entry.path !== s.path), entry];
            const sortedStack = newStack.sort((a, b) => a.path.length - b.path.length);

            return sortedStack;
        });
    }, []); // tslint:disable-line: align

    const unregisterEntry = React.useCallback((entry: BreadcrumbEntry) => {
        // tslint:disable-next-line: no-console
        console.log('UNstacking' + JSON.stringify(entry));
        setStack(currentState => {
            const newStack = currentState.filter(s => entry.path !== s.path);
            return newStack;
        });
    }, []); // tslint:disable-line: align

    return {stack, registerEntry, unregisterEntry};
};
