/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useBreadcrumbContext } from './useBreadcrumbContext';

export interface UseBreadcrumbEntryProps {
    link?: boolean;
    name: string;
    suffix?: string;
}

export const useBreadcrumbEntry = ({ name, link, suffix }: UseBreadcrumbEntryProps) => {
    const { registerEntry, unregisterEntry } = useBreadcrumbContext();
    const { path, url } = useRouteMatch();

    // tslint:disable-next-line: no-console
    console.log('url' + url);

    React.useEffect(() => {
        registerEntry({ name, link, path, suffix, url });
        return () => {
            unregisterEntry({ name, link, path, suffix, url });
        };
    }, [ suffix, name, link ]); // tslint:disable-line: align
};
