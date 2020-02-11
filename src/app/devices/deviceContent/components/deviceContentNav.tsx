/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Nav, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import '../../../css/_deviceContentNav.scss';

export interface DeviceContentNavDataProps {
    deviceId: string;
    isLoading: boolean;
    isPnPDevice: boolean;
    isEdgeDevice: boolean;
}

export interface DeviceContentNavDispatchProps {
    setComponentName: (interfaceId: string) => void;
}

export const NAV_LINK_ITEMS = [ROUTE_PARTS.IDENTITY, ROUTE_PARTS.TWIN, ROUTE_PARTS.EVENTS, ROUTE_PARTS.METHODS, ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE];
export const NAV_LINK_ITEMS_NONEDGE = [...NAV_LINK_ITEMS, ROUTE_PARTS.MODULE_IDENTITY];
export const NAV_LINK_ITEM_PNP = ROUTE_PARTS.DIGITAL_TWINS;

export type DeviceContentNavProps = DeviceContentNavDataProps & DeviceContentNavDispatchProps & RouteComponentProps;
export default class DeviceContentNavComponent extends React.Component<DeviceContentNavProps> {
    public render(): JSX.Element {

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="view-scroll">
                        {this.createNavLinks(context)}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly createNavLinks = (context: LocalizationContextInterface) => {
        const { deviceId, isPnPDevice, isEdgeDevice } = this.props;
        const url = this.props.match.url;

        const navItems = isEdgeDevice ? NAV_LINK_ITEMS : NAV_LINK_ITEMS_NONEDGE;
        const nonPnpNavLinks = navItems.map((nav: string) => ({
            key: nav,
            name: context.t((ResourceKeys.deviceContent.navBar as any)[nav]), // tslint:disable-line:no-any
            url: `#${url}/${nav}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
        }));

        const groups: INavLinkGroup[] = [];
        groups.push({
            links: nonPnpNavLinks,
            name: context.t(ResourceKeys.deviceContent.navBar.nonpnp)
        });

        if (!isEdgeDevice && isPnPDevice) {
            const pnpNavLinks = [{
                key: NAV_LINK_ITEM_PNP,
                name: context.t((ResourceKeys.deviceContent.navBar as any)[NAV_LINK_ITEM_PNP]), // tslint:disable-line:no-any
                url: `#${url}/${NAV_LINK_ITEM_PNP}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
            }];
            groups.push({
                links: pnpNavLinks,
                name: context.t(ResourceKeys.deviceContent.navBar.pnp),
            });
        }

        return (
            <div role="navigation">
                <Nav
                    onRenderGroupHeader={this.onRenderGroupHeader}
                    groups={groups}
                />
            </div>
        );
    }

    private readonly onRenderGroupHeader = (group: INavLinkGroup) => {
        return <Label className="nav-label">{group.name}</Label>;
    }
}
