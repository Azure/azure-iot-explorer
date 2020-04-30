/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTE_PARTS } from '../../constants/routes';

export const HomeViewNavigation: React.FC = props => {
    return (
        <nav role="navigation">
            <NavLink to={`/${ROUTE_PARTS.HOME}`}>Connections</NavLink>
            <NavLink to={`/${ROUTE_PARTS.HOME}/repos`}>Plug and Play Configurations</NavLink>
        </nav>
    );
};
