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

export interface BreadcrumbEntry {
    text: string;
    key: string;
    href?: string;
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

       private readonly getItems = (t: TranslationFunction) => {
        const { hubName, location } = this.props;
        const { pathname, search } = location;
        const pathComponents = pathname.split('/').filter(s => s !== '');

        const items: BreadcrumbEntry[] = [];
        // tslint:disable-next-line:cyclomatic-complexity
        pathComponents.forEach((pathComponent, index) => {
            if (pathComponent.toLowerCase() === ROUTE_PARTS.RESOURCE.toLowerCase() && index < pathComponents.length) {
                items.push({
                    key: 'Hub',
                    text: t(ResourceKeys.breadcrumb.hub, {hubName: this.getShortHubName(hubName)})
                });
                return;
            }

            if (pathComponent.toLowerCase() === ROUTE_PARTS.DEVICES.toLowerCase()) {
                items.push({
                    href: (index !== pathComponents.length - 1) ? `#/${ROUTE_PARTS.RESOURCE}/${hubName}/${ROUTE_PARTS.DEVICES}` : '',
                    key: 'Devices',
                    text: t(ResourceKeys.breadcrumb.devices)
                });
                return;
            }

            if (pathComponent.toLowerCase() === ROUTE_PARTS.DETAIL.toLowerCase()) {
                const deviceId = this.getDeviceIdFromSearch(search);
                items.push({
                    href: `#/${ROUTE_PARTS.RESOURCE}/${hubName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.IDENTITY}?${ROUTE_PARAMS.DEVICE_ID}=${deviceId}`,
                    key: 'Device',
                    text: deviceId
                });

                if (index < pathComponents.length - 1 && pathComponents[index + 1].toLowerCase() !== ROUTE_PARTS.DIGITAL_TWINS.toLowerCase()) {
                    const remainingPathComponents = pathComponents.slice(index + 1);
                    items.push(...this.buildDeviceDetails(remainingPathComponents, hubName, deviceId, t));
                }
                return;
            }

            if (pathComponent.toLowerCase() === ROUTE_PARTS.DIGITAL_TWINS.toLowerCase()) {
                const deviceId = this.getDeviceIdFromSearch(search);
                const interfaceId = this.getInterfaceIdFromSearch(search);
                items.push({
                    href: `#/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.DIGITAL_TWINS}/${ROUTE_PARTS.INTERFACES}/?${ROUTE_PARAMS.DEVICE_ID}=${deviceId}&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`,
                    key: `device_${deviceId}_${interfaceId}`,
                    text: interfaceId
                });

                if (index < pathComponents.length - 1) {
                    const remainingPathComponents = pathComponents.slice(index + 1);
                    items.push(...this.buildDigitalTwinDetails(remainingPathComponents, hubName, deviceId, interfaceId, t));
                }
                return;
            }
        });

        // frags.forEach((frag, index) => {
        //     switch (frag) {
        //         case ROUTE_PARTS.DIGITAL_TWINS:
        //             const interfaceFrag = this.getInterfaceFrag(search);
        //             if (interfaceFrag) {
        //                 items.push(interfaceFrag);
        //             }
        //             break;
        //         case ROUTE_PARTS.MODULE_IDENTITY:
        //             items.push(this.getModuleIdentityFrag(search, t));
        //             break;
        //         default:
        //             if (index < frags.length - 1) {
        //                 // tslint:disable-next-line: no-any
        //                 items.push({ text: t((ResourceKeys.deviceContent.navBar as any)[frag]), key: frag, href: frag });
        //             } else {
        //                 // tslint:disable-next-line: no-any
        //                 items.push({ text: t((ResourceKeys.deviceContent.navBar as any)[frag]), key: frag });
        //             }

        //     }
        // });

        return items;
    }

    private buildDeviceDetails = (pathComponents: string[], hubName: string, deviceId: string, t: TranslationFunction): BreadcrumbEntry[] => {
        const entries: BreadcrumbEntry[] = [];
        const paths = [...pathComponents];
        const query = `${ROUTE_PARAMS.DEVICE_ID}=${deviceId}`;
        let basePath = `#/${ROUTE_PARTS.RESOURCE}/${hubName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}`;
        while (paths.length > 0) {
            basePath = `${basePath}/${paths[0]}`;
            entries.push({
                href: paths.length !== 1 ? `${basePath}${query}` : '',
                key: paths[0],
                text: t((ResourceKeys.deviceContent.navBar as any)[paths[0]]) // tslint:disable-line:no-any
            });

            paths.splice(0, 1);
        }

        return entries;
    }

    private buildDigitalTwinDetails = (pathComponents: string[], hubName: string, deviceId: string, interfaceId: string, t: TranslationFunction): BreadcrumbEntry[] => {
        const entries: BreadcrumbEntry[] = [];
        const paths = [...pathComponents];
        const query = `${ROUTE_PARAMS.DEVICE_ID}=${deviceId}&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`;
        let basePath = `#/${ROUTE_PARTS.RESOURCE}/${hubName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.DIGITAL_TWINS}`;
        while (paths.length > 0) {
            basePath = `${basePath}/${paths[0]}`;
            entries.push({
                href: paths.length !== 1 ? `${basePath}${query}` : '',
                key: paths[0],
                text: t((ResourceKeys.deviceContent.navBar as any)[paths[0]]) // tslint:disable-line:no-any
            });

            paths.splice(0, 1);
        }

        return entries;
    }

    private readonly getShortHubName = (hostName: string) => {
        return hostName && hostName.replace(/\..*/, '');
    }

    private readonly getDeviceIdFromSearch = (search: string) => {
        return new URLSearchParams(search).get(ROUTE_PARAMS.DEVICE_ID);
    }

    private readonly getInterfaceIdFromSearch = (search: string) => {
        return new URLSearchParams(search).get(ROUTE_PARAMS.INTERFACE_ID);

    // public readonly getInterfaceFrag = (search: string) => {
    //     const deviceId = this.getDeviceIdFromSearch(search);
    //     // can't have a ${ROUTE_PARTS.DIGITAL_TWINS} frag without a device
    //     const interfaceId = new URLSearchParams(search).get(ROUTE_PARAMS.INTERFACE_ID);
    //     if (interfaceId && '' !== interfaceId) {
    //         return {
    //             href: `#/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.DIGITAL_TWINS}/${ROUTE_PARTS.INTERFACES}/?${ROUTE_PARAMS.DEVICE_ID}=${deviceId}&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`,
    //             key: `device_${deviceId}_${interfaceId}`,
    //             text: interfaceId
    //         };
    //     }
    // }

    // public readonly getModuleIdentityFrag = (search: string, t: TranslationFunction) => {
    //     const deviceId = this.getDeviceIdFromSearch(search);
    //     // can't have a ${ROUTE_PARTS.MODULE_IDENTITY} frag interface without a device
    //     const moduleId = new URLSearchParams(search).get(ROUTE_PARAMS.MODULE_ID);
    //     if (moduleId) {
    //         return {
    //             href: `#/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.MODULE_IDENTITY}/?${ROUTE_PARAMS.DEVICE_ID}=${deviceId}`,
    //             key: `ROUTE_PARTS.MODULE_IDENTITY_${moduleId}`,
    //             text: t(ResourceKeys.deviceContent.navBar.moduleIdentity)
    //         };
    //     }
    //     else {
    //         return {
    //             key: ROUTE_PARTS.MODULE_IDENTITY,
    //             text: t(ResourceKeys.deviceContent.navBar.moduleIdentity)
    //         };
    //     }
    // }
}
