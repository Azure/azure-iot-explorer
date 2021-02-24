/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { BreadcrumbEntry as BreadcrumbEntryProps } from '../model';

export const BreadcrumbEntry: React.FC<BreadcrumbEntryProps> = ({ link, url, suffix, name }) => {
    return (
        <li className="breadcrumb-item">
            {link &&
                <NavLink to={`${url}${suffix || ''}`}>
                    {name}
                </NavLink>
            }
            {!link && <>{name}</>}
        </li>
    );
};
