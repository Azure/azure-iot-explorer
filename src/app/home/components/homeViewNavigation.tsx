/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import '../../css/_layouts.scss';
import './homeViewNavigation.scss';

export const HomeViewNavigation: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="nav-link-bar view">
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
