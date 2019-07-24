/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { Nav, INavLink, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { Label } from 'office-ui-fabric-react';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
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

const NAV_LINK_ITEMS_PNP = ['interfaces', 'settings', 'properties', 'commands', 'events'];
const NAV_LINK_ITEMS_NONPNP = ['identity', 'twin', 'events'];

export default class DeviceContentNavComponent extends React.Component<DeviceContentNavDataProps & DeviceContentNavDispatchProps, DeviceContentNavState> {
    constructor(props: DeviceContentNavDataProps & DeviceContentNavDispatchProps) {
        super(props);
        const expandedInterfaceMap = new Map();
        if (this.props.selectedInterface) {
            expandedInterfaceMap.set(this.props.selectedInterface, true);
        }
        this.state = {expandedInterfaceMap};
    }

    /*public shouldComponentUpdate(nextProps: DeviceContentNavDataProps & DeviceContentNavDispatchProps, nextState: DeviceContentNavState) {
        return  nextProps.deviceId !== this.props.deviceId ||
                nextProps.interfaceIds !== this.props.interfaceIds ||
                nextProps.isLoading !== this.props.isLoading ||
                nextProps.isPnPDevice !== this.props.isPnPDevice ||
                nextProps.selectedInterface !== this.props.selectedInterface ||
                nextState !== this.state; // tslint:disable-line:cyclomatic-complexity
    }*/

    public render(): JSX.Element {

        if (this.props.isLoading) {
            return (
                <Shimmer/>
            );
        }

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
        const { deviceId, isPnPDevice, interfaceIds } = this.props;

        const nonPnpNavLinks = NAV_LINK_ITEMS_NONPNP.map((nav: string) => ({
            key: nav,
            name: context.t((ResourceKeys.deviceContent.navBar as any)[nav]), // tslint:disable-line:no-any
            url: `#/devices/detail/${nav}/?id=${encodeURIComponent(deviceId)}`
        }));

        const pnpNavGroupsLinks = isPnPDevice && interfaceIds && interfaceIds.map((id: string) => ({
            isExpanded: this.state.expandedInterfaceMap.get(id),
            links: NAV_LINK_ITEMS_PNP.map((nav: string): INavLink => ({
                name: context.t((ResourceKeys.deviceContent.navBar as any)[nav]), // tslint:disable-line:no-any
                onClick: this.onNestedChildLinkClick,
                parentId: id,
                url: `#/devices/detail/digitalTwins/${nav}/?id=${encodeURIComponent(deviceId)}&interfaceId=${id}`
            })),
            name: id,
            onClick: this.onChildLinkExpand,
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
