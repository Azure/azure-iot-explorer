/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Route, NavLink, RouteComponentProps } from 'react-router-dom';
import { useLocalizationContext } from '../contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../constants/routes';
import { getActiveAzureResourceHostNameSelector } from '../../azureResource/selectors';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString } from '../utils/queryStringHelper';
import '../../css/_breadcrumb.scss';

const Breadcrumb = () => (
    <ul className="breadcrumb">
        <Route path="/:path" component={BreadcrumbItemContainer} />
    </ul>
);

export interface BreadcrumbItemDataProps extends RouteComponentProps{
    hostName: string;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemDataProps> = props => {

    // tslint:disable-next-line:cyclomatic-complexity
    const renderBreadcrumbItem = (route: string | undefined) => {
        const { t } = useLocalizationContext();
        if (route) {
            switch (route) {
                case ROUTE_PARTS.RESOURCE:
                    return <></>;
                case props.hostName:
                    return renderTextItem(t(ResourceKeys.breadcrumb.hub, {hubName: getShortHubName()}));
                case ROUTE_PARTS.DEVICE_DETAIL:
                    return renderTextItem(getDeviceIdFromQueryString(props));
                case ROUTE_PARTS.DIGITAL_TWINS_DETAIL:
                    return renderTextItem(getInterfaceIdFromQueryString(props));
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
        const { t } = useLocalizationContext();
        const resourceKey = (ResourceKeys.breadcrumb as any)[route]; // tslint:disable-line:no-any
        return resourceKey ? t(resourceKey) : route;
    };

    const getCurrentUrl = () => {
        let url = props.match.url;
        if (url.endsWith('/')) {
            url = url.slice(0, -1); // remove trailing slash
        }
        return url.split('/').pop();
    };

    const renderLinkItem = (linkContent: string, searchParams?: ROUTE_PARAMS[]) => {
        const { match } = props;
        let href = match.url;
        if (searchParams) {
            href += '/?';
            searchParams.forEach((para, index) => {
                switch (para) {
                    case ROUTE_PARAMS.DEVICE_ID:
                        href += `${ROUTE_PARAMS.DEVICE_ID}=${getDeviceIdFromQueryString(props)}`;
                        break;
                    case ROUTE_PARAMS.INTERFACE_ID:
                        href += `${ROUTE_PARAMS.INTERFACE_ID}=${getInterfaceIdFromQueryString(props)}`;
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
                {match.isExact ?
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

    return(
        <>
            {renderBreadcrumbItem(getCurrentUrl())}
            <Route path={`${props.match.url}/:path`} component={BreadcrumbItemContainer} />
        </>

    );
};

export type BreadcrumbItemContainerProps = RouteComponentProps;
export const BreadcrumbItemContainer: React.FC<BreadcrumbItemContainerProps> = props => {
    const viewProps = {
        hostName: useSelector(getActiveAzureResourceHostNameSelector),
        ...props
    };
    return <BreadcrumbItem {...viewProps} />;
};

export default Breadcrumb;
