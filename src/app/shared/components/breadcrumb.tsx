/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, NavLink, RouteComponentProps } from 'react-router-dom';
import { TranslationFunction } from 'i18next';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../constants/routes';
import { StateInterface } from '../redux/state';
import { getActiveAzureResourceHostNameSelector } from '../../azureResource/selectors';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString } from '../utils/queryStringHelper';
import '../../css/_breadcrumb.scss';

const Breadcrumb = () => (
    <ul className="breadcrumb">
        <Route path="/:path" component={BreadcrumbItemContainer} />
    </ul>
);

export interface BreadcrumbItemDataProps {
    hostName: string;
}

export class BreadcrumbItem extends React.Component<BreadcrumbItemDataProps & RouteComponentProps> {
    public render() {
        const { match } = this.props;
        return(

            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.renderBreadcrumbItem(context.t, this.getCurrentUrl())}
                        <Route path={`${match.url}/:path`} component={BreadcrumbItemContainer} />
                    </>
                )}
            </LocalizationContextConsumer>

        );
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private renderBreadcrumbItem = (t: TranslationFunction, route: string | undefined) => {
        if (route) {
            switch (route) {
                case ROUTE_PARTS.RESOURCE:
                    return <></>;
                case this.props.hostName:
                    return this.renderTextItem(t(ResourceKeys.breadcrumb.hub, {hubName: this.getShortHubName(route)}));
                case ROUTE_PARTS.DEVICE_DETAIL:
                    return this.renderTextItem(getDeviceIdFromQueryString(this.props));
                case ROUTE_PARTS.DIGITAL_TWINS:
                    return this.renderTextItem(getInterfaceIdFromQueryString(this.props));
                case ROUTE_PARTS.MODULE_IDENTITY:
                    return this.renderLinkItem(this.getLocalizedKey(t, route), [ROUTE_PARAMS.DEVICE_ID]);
                default:
                    return this.renderLinkItem(this.getLocalizedKey(t, route));
            }
        }
        return <></>;
    }

    private getShortHubName = (hostName: string) => {
        return hostName && hostName.replace(/\..*/, '');
    }

    private getLocalizedKey = (t: TranslationFunction, route: string | undefined) => {
        const resourceKey = (ResourceKeys.breadcrumb as any)[route]; // tslint:disable-line:no-any
        return resourceKey ? t(resourceKey) : route;
    }

    private getCurrentUrl = () => {
        let url = this.props.match.url;
        if (url.endsWith('/')) {
            url = url.slice(0, -1); // remove trailing slash
        }
        return url.split('/').pop();
    }

    private renderLinkItem = (linkContent: string, searchParams?: ROUTE_PARAMS[]) => {
        const { match } = this.props;
        let href = match.url;
        if (searchParams) {
            href += '/';
            searchParams.forEach(para => {
                switch (para) {
                    case ROUTE_PARAMS.DEVICE_ID:
                        href += `?${ROUTE_PARAMS.DEVICE_ID}=${getDeviceIdFromQueryString(this.props)}`;
                        break;
                    case ROUTE_PARAMS.INTERFACE_ID:
                        href += `?${ROUTE_PARAMS.INTERFACE_ID}=${getInterfaceIdFromQueryString(this.props)}`;
                        break;
                    default:
                        return;
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
    }

    private renderTextItem = (text: string) => {
        return (
            <li className="breadcrumb-item">
                {text}
            </li>
        );
    }
}

const mapStateToProps = (state: StateInterface): BreadcrumbItemDataProps => {
    return {
        hostName: getActiveAzureResourceHostNameSelector(state)
    };
};

const BreadcrumbItemContainer = connect(mapStateToProps, {})(BreadcrumbItem);

export default Breadcrumb;
