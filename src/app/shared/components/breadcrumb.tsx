/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, NavLink, useLocation, useRouteMatch } from 'react-router-dom';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../constants/routes';
import { ACTIVE_CONNECTION_STRING } from '../../constants/browserStorage';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../utils/queryStringHelper';
import '../../css/_breadcrumb.scss';

export const Breadcrumb: React.FC = () => {
    const [ hostName, setHostName ] = React.useState<string>('');

    React.useEffect(() => {
        const connectionString = localStorage.getItem(ACTIVE_CONNECTION_STRING);
        const host = getConnectionInfoFromConnectionString(connectionString).hostName;
        setHostName(host);
    },              []);

    const renderBreadcrumbItem = () => <BreadcrumbItem hostName={hostName}/>;

    return (
        <ul className="breadcrumb">
            <Route path="/:path" component={renderBreadcrumbItem} />
        </ul>
    );
};

export interface BreadcrumbItemDataProps {
    hostName: string;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemDataProps> = props => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);

    // tslint:disable-next-line:cyclomatic-complexity
    const renderBreadcrumbItem = (route: string | undefined) => {
        if (route) {
            switch (route) {
                case ROUTE_PARTS.HOME:
                    return <li className="breadcrumb-item"><NavLink to={`/${ROUTE_PARTS.HOME}`}>{t(ResourceKeys.common.home)}</NavLink></li>;
                case ROUTE_PARTS.RESOURCE:
                    return <li className="breadcrumb-item"><NavLink to={`/${ROUTE_PARTS.HOME}`}>{t(ResourceKeys.common.home)}</NavLink></li>;
                case props.hostName:
                    return renderTextItem(getShortHubName());
                case ROUTE_PARTS.DEVICE_DETAIL:
                    return renderTextItem(deviceId);
                case ROUTE_PARTS.DIGITAL_TWINS_DETAIL:
                    return renderTextItem(componentName);
                case ROUTE_PARTS.MODULE_IDENTITY:
                        return renderLinkItem(getLocalizedKey(route), [ROUTE_PARAMS.DEVICE_ID]);
                case ROUTE_PARTS.DIGITAL_TWINS:
                    return renderLinkItem(getLocalizedKey(route), [ROUTE_PARAMS.DEVICE_ID]);
                default:
                    return renderLinkItem(getLocalizedKey(route));
            }
        }
        return <></>;
    };

    const getShortHubName = () => {
        return props.hostName && props.hostName.replace(/\..*/, '');
    };

    const getLocalizedKey = (route: string | undefined) => {
        const resourceKey = (ResourceKeys.breadcrumb as any)[route]; // tslint:disable-line:no-any
        return resourceKey ? t(resourceKey) : route;
    };

    const getCurrentUrl = () => {
        let currentUrl = url;
        if (url.endsWith('/')) {
            currentUrl = url.slice(0, -1); // remove trailing slash
        }
        return currentUrl.split('/').pop();
    };

    const renderLinkItem = (linkContent: string, searchParams?: ROUTE_PARAMS[]) => {
        let href = url;
        if (searchParams) {
            href += '/?';
            searchParams.forEach((para, index) => {
                switch (para) {
                    case ROUTE_PARAMS.DEVICE_ID:
                        href += `${ROUTE_PARAMS.DEVICE_ID}=${deviceId}`;
                        break;
                    case ROUTE_PARAMS.COMPONENT_NAME:
                        href += `${ROUTE_PARAMS.COMPONENT_NAME}=${componentName}`;
                        break;
                    default:
                        break;
                }
                if (index !== searchParams.length - 1) {
                    href += '&';
                }
            });
        }
        return (
            <li className="breadcrumb-item">
                {url === pathname ?
                    linkContent :
                    <NavLink to={href}>
                        {linkContent}
                    </NavLink>
                }
            </li>
        );
    };

    const renderTextItem = (text: string) => {
        return (
            <li className="breadcrumb-item">
                {text}
            </li>
        );
    };

    const renderNextBreadcrumb = () => <BreadcrumbItem hostName={props.hostName}/>;

    return(
        <>
            {renderBreadcrumbItem(getCurrentUrl())}
            <Route path={`${url}/:path`} render={renderNextBreadcrumb} />
        </>

    );
};
