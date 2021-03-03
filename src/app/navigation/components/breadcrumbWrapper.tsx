/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useBreadcrumbEntry, UseBreadcrumbEntryProps } from '../hooks/useBreadcrumbEntry';

export type BreadcrumbWrapperProps = UseBreadcrumbEntryProps;

export const BreadcrumbWrapper: React.FC<BreadcrumbWrapperProps> = props => {
    useBreadcrumbEntry(props);
    return <>{props.children}</>;
};
