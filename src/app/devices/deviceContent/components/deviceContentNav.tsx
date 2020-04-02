/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Nav, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import '../../../css/_deviceContentNav.scss';

export interface DeviceContentNavDataProps {
    deviceId: string;
    isLoading: boolean;
    digitalTwinModelId: string;
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
                    this.createNavLinks(context)
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly createNavLinks = (context: LocalizationContextInterface) => {
        const { deviceId, digitalTwinModelId, isEdgeDevice } = this.props;
        const url = this.props.match.url;

        const navItems = isEdgeDevice ? NAV_LINK_ITEMS : NAV_LINK_ITEMS_NONEDGE;
        const navLinks = navItems.map((nav: string) => ({
            key: nav,
            name: context.t((ResourceKeys.deviceContent.navBar as any)[nav]), // tslint:disable-line:no-any
            url: `#${url}/${nav}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
        }));

        if (!isEdgeDevice && digitalTwinModelId) {
            navLinks.push({
                key: NAV_LINK_ITEM_PNP,
                name: context.t((ResourceKeys.deviceContent.navBar as any)[NAV_LINK_ITEM_PNP]), // tslint:disable-line:no-any
                url: `#${url}/${NAV_LINK_ITEM_PNP}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
            });
        }

        const groups: INavLinkGroup[] = [{ links: navLinks }];

        return (
            <div role="navigation">
                <Nav
                    groups={groups}
                />
            </div>
        );
    }
}
