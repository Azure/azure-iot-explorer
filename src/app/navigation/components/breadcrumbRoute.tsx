/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { BreadcrumbWrapper, BreadcrumbWrapperProps } from './breadcrumbWrapper';

export interface BreadcrumbRouteProps {
    breadcrumb: BreadcrumbWrapperProps;
    children?: React.ReactNode;
}

export const BreadcrumbRoute: React.FC<BreadcrumbRouteProps> = props => {
    return (
        <BreadcrumbWrapper {...props.breadcrumb} >
            {props.children}
        </BreadcrumbWrapper>
    );
};
