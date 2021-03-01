/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { BreadcrumbEntry as BreadcrumbEntryProps } from '../model';

export const Breadcrumb: React.FC<BreadcrumbEntryProps> = ({ disableLink, url, suffix, name }) => {
    return (
        <li className="breadcrumb-item">
            {disableLink && <>{name}</>}
            {!disableLink &&
                <NavLink to={`${url}${suffix || ''}`}>
                    {name}
                </NavLink>
            }
        </li>
    );
};
