/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { RouteComponentProps } from 'react-router-dom';
import { TranslationFunction } from 'i18next';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../constants/routes';
import '../../css/_breadcrumb.scss';

export interface BreadCrumbProps {
    hubName: string;
}

export default class BreadcrumbComponent extends React.Component<BreadCrumbProps & RouteComponentProps>{
    constructor(props: BreadCrumbProps & RouteComponentProps) {
        super(props);
    }

    public render() {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <Breadcrumb
                        className="device-content-breadcrumb"
                        items={this.getItems(context.t)}
                    />
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly getShortHubName = (hostName: string) => {
        return hostName && hostName.replace(/\..*/, '');
    }

    private readonly getItems = (t: TranslationFunction) => {
        const { hubName, location } = this.props;
        const { pathname, search } = location;
        const items: Array<{ text: string, key: string, href?: string }> = [
            { text: t(ResourceKeys.breadcrumb.hub, {hubName: this.getShortHubName(hubName)}), key: 'Hub'},
            { text: t(ResourceKeys.breadcrumb.devices), key: 'Devices', href: `#/${ROUTE_PARTS.DEVICES}` },
        ];

        const frags = pathname && pathname.replace(/(#\/)?devices\//, '').split('/').filter(frag => '' !== frag);

        if (frags.length > 0) {
            const deviceFrag = this.getDeviceFrag(search);
            if (deviceFrag) {
                // remove the /detail and put in the deviceId
                frags.splice(0, 1);
                items.push(deviceFrag);
            }
        }
        frags.forEach((frag, index) => {
            if ('digitalTwins' === frag) {
                const interfaceFrag = this.getInterfaceFrag(search);
                if (interfaceFrag) {
                    items.push(interfaceFrag);
                }
            } else {
                if (index < frags.length - 1) {
                    // tslint:disable-next-line: no-any
                    items.push({ text: t((ResourceKeys.deviceContent.navBar as any)[frag]), key: frag, href: frag });
                } else {
                    // tslint:disable-next-line: no-any
                    items.push({ text: t((ResourceKeys.deviceContent.navBar as any)[frag]), key: frag });
                }
            }
        });
        return items;
    }

    private readonly getDeviceIdFromSearch = (search: string) => {
        return new URLSearchParams(search).get(ROUTE_PARAMS.DEVICE_ID);
    }

    private readonly getDeviceFrag = (search: string) => {
        const deviceId = this.getDeviceIdFromSearch(search);
        if (deviceId) {
            return {
                href: `#/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.IDENTITY}/?${ROUTE_PARAMS.DEVICE_ID}=${deviceId}`,
                key: `device_${deviceId}`,
                text: deviceId
            };
        }
        return null;
    }

    public readonly getInterfaceFrag = (search: string) => {
        const deviceId = this.getDeviceIdFromSearch(search);
        // can't have a device interface without a device
        if (deviceId) {
            const interfaceId = new URLSearchParams(search).get(ROUTE_PARAMS.INTERFACE_ID);
            if (interfaceId && '' !== interfaceId) {
                return {
                    href: `#/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.DIGITAL_TWINS}/${ROUTE_PARTS.INTERFACES}/?${ROUTE_PARAMS.DEVICE_ID}=${deviceId}&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`,
                    key: `device_${deviceId}_${interfaceId}`,
                    text: interfaceId
                };
            }
        }
        return null;
    }
}
