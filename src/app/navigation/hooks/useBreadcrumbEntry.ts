/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useBreadcrumbContext } from './useBreadcrumbContext';

export interface UseBreadcrumbEntryProps {
    disableLink?: boolean;
    name: string;
    suffix?: string;
}

export const useBreadcrumbEntry = ({ name, disableLink, suffix }: UseBreadcrumbEntryProps) => {
    const { registerEntry, unregisterEntry } = useBreadcrumbContext();
    const { path, url } = useRouteMatch();

    React.useEffect(() => {
        registerEntry({ name, disableLink, path, suffix, url });
        return () => {
            unregisterEntry({ name, disableLink, path, suffix, url });
        };
    }, [ suffix, name, disableLink ]); // tslint:disable-line: align
};
