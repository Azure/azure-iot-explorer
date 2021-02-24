import * as React from 'react';

export interface Entry {
    name: string;
    link?: boolean;
    path: string;
    search: string;
    url: string;
}

export const useBreadcrumbNavigation = (): BreadcrumbContextType => {
    const [stack, setStack] = React.useState<Entry[]>([]);

    const registerEntry = React.useCallback((entry: Entry) => {
        setStack(currentState => {
            const newStack = [...currentState.filter(s => entry.path !== s.path), entry];
            const sortedStack = newStack.sort((a, b) => a.path.length - b.path.length);

            return sortedStack;
        });
    }, []); // tslint:disable-line: align

    const unregisterEntry = React.useCallback((entry: Entry) => {
        setStack(currentState => {
            const newStack = currentState.filter(s => entry.path !== s.path);
            return newStack;
        });
    }, []); // tslint:disable-line: align

    return {stack, registerEntry, unregisterEntry};
};

export interface BreadcrumbContextType {
    stack: Entry[];
    registerEntry(entry: Entry): void;
    unregisterEntry(entry: Entry): void;
}

export const BreadcrumbContext = React.createContext<BreadcrumbContextType>({
    // tslint:disable-next-line: no-empty
    registerEntry: () => {},
    stack: [],
    // tslint:disable-next-line: no-empty
    unregisterEntry: () => {}
});
export const useBreadcrumbContext = () => React.useContext<BreadcrumbContextType>(BreadcrumbContext);
