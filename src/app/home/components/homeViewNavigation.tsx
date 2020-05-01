/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTE_PARTS } from '../../constants/routes';
import '../../css/_layouts.scss';
import './homeViewNavigation.scss';

export const HomeViewNavigation: React.FC = props => {
    return (
        <div className="view">
            <div className="view-scroll-vertical">
                <nav role="navigation">
                    <NavLink className="nav-link" activeClassName="nav-link-active" to={`/${ROUTE_PARTS.HOME}`} title="hello">Connections</NavLink>
                    <NavLink className="nav-link" activeClassName="nav-link-active" to={`/${ROUTE_PARTS.HOME}/repos`}>Plug and Play Configurations</NavLink>
                </nav>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
                <div>Heree</div>
            </div>
        </div>
    );
};
