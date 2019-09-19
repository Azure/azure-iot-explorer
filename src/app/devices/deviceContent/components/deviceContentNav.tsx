/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Nav, INavLink, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import '../../../css/_deviceContentNav.scss';

export interface DeviceContentNavDataProps {
    deviceId: string;
    interfaceIds: string[];
    isLoading: boolean;
    isPnPDevice: boolean;
    selectedInterface: string;
}

export interface DeviceContentNavDispatchProps {
    setInterfaceId: (interfaceId: string) => void;
}

interface DeviceContentNavState {
    expandedInterfaceMap: Map<string, boolean>;
}

export const NAV_LINK_ITEMS_PNP = [ROUTE_PARTS.INTERFACES, ROUTE_PARTS.SETTINGS, ROUTE_PARTS.PROPERTIES, ROUTE_PARTS.COMMANDS, ROUTE_PARTS.EVENTS];
export const NAV_LINK_ITEMS_NONPNP = [ROUTE_PARTS.IDENTITY, ROUTE_PARTS.TWIN, ROUTE_PARTS.METHODS, ROUTE_PARTS.EVENTS];

export default class DeviceContentNavComponent extends React.Component<DeviceContentNavDataProps & DeviceContentNavDispatchProps, DeviceContentNavState> {
    constructor(props: DeviceContentNavDataProps & DeviceContentNavDispatchProps) {
        super(props);
        const expandedInterfaceMap = new Map();
        if (this.props.selectedInterface) {
            expandedInterfaceMap.set(this.props.selectedInterface, true);
        }
        this.state = {expandedInterfaceMap};
    }

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
        const { deviceId, interfaceIds, isPnPDevice } = this.props;

        const nonPnpNavLinks = NAV_LINK_ITEMS_NONPNP.map((nav: string) => ({
            key: nav,
            name: context.t((ResourceKeys.deviceContent.navBar as any)[nav]), // tslint:disable-line:no-any
            url: `#/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${nav}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
        }));

        const pnpNavGroupsLinks = isPnPDevice && interfaceIds && interfaceIds.map((id: string) => ({
            isExpanded: this.state.expandedInterfaceMap.get(id),
            links: NAV_LINK_ITEMS_PNP.map((nav: string): INavLink => ({
                key: `${id}-${nav}`,
                name: context.t((ResourceKeys.deviceContent.navBar as any)[nav]), // tslint:disable-line:no-any
                onClick: this.onNestedChildLinkClick,
                parentId: id,
                url: `#/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.DIGITAL_TWINS}/${nav}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.INTERFACE_ID}=${id}`
            })),
            name: id,
            url: ''
        }));

        const groups = [];
        groups.push({
            links: nonPnpNavLinks,
            name: context.t(ResourceKeys.deviceContent.navBar.nonpnp),
        });
        if (isPnPDevice) {
            groups.push({
                links: pnpNavGroupsLinks,
                name: context.t(ResourceKeys.deviceContent.navBar.pnp),
            });
        }

        return (
            <div role="navigation">
                <Nav
                    onLinkExpandClick={this.onChildLinkExpand}
                    onRenderGroupHeader={this.onRenderGroupHeader}
                    groups={groups}
                />
            </div>
        );
    }

    private readonly onRenderGroupHeader = (group: INavLinkGroup) => {
        return <Label className="nav-label">{group.name}</Label>;
      }

    private readonly onNestedChildLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
        this.props.setInterfaceId(item.parentId);
    }

    private readonly onChildLinkExpand = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
        const expandedInterfaceMap = new Map(this.state.expandedInterfaceMap);
        expandedInterfaceMap.set(item.name, !item.isExpanded);
        this.setState({
            expandedInterfaceMap
        });
    }
}
