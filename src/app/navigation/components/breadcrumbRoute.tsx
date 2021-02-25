/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { BreadcrumbWrapper, BreadcrumbWrapperProps } from './breadcrumbWrapper';

export type ConstrainedRouteProps = Pick<RouteProps, 'location' | 'path' | 'exact' | 'sensitive' | 'strict'>;
export interface BreadcrumbRouteProps {
    routeProps: ConstrainedRouteProps;
    breadcrumbProps: BreadcrumbWrapperProps;
}

export const BreadcrumbRoute: React.FC<BreadcrumbRouteProps> = ({ breadcrumbProps, routeProps, children}) => {
    return (
        <Route {...routeProps}>
            <BreadcrumbWrapper {...breadcrumbProps} >
                {children}
            </BreadcrumbWrapper>
        </Route>
    );
};
