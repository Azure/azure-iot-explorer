/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import '../../css/_layouts.scss';
import './homeViewNavigation.scss';

export const HomeViewNavigation: React.FC = props => {
    const { t } = useLocalizationContext();

    return (
        <div className="nav-bar view">
            <div className="view-scroll-vertical">
                <nav role="navigation">
                    <NavLink
                        className="nav-link"
                        activeClassName="nav-link-active"
                        to={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.RESOURCES}`}
                        title={t(ResourceKeys.breadcrumb.resources)}
                    >
                       {t(ResourceKeys.breadcrumb.resources)}
                    </NavLink>
                    <NavLink
                        className="nav-link"
                        activeClassName="nav-link-active"
                        to={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}`}
                        title={t(ResourceKeys.breadcrumb.repos)}
                    >
                         {t(ResourceKeys.breadcrumb.repos)}
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};
