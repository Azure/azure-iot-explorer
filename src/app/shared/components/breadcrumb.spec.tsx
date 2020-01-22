/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { BreadcrumbItemDataProps, BreadcrumbItem } from './breadcrumb';
import { ROUTE_PARTS } from '../../constants/routes';
import { testWithLocalizationContext } from '../utils/testHelpers';

describe('Breadcrumb', () => {
    const hostName = 'hub.azure-devices.net';
    const pathname = `/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}/`;
    const location = {
        pathname,
        search: '?deviceId=newdevice"'
    };
    const routerprops: any = { // tslint:disable-line:no-any
        history: {
            location,
        },
        location,
        match: {
            isExact: false,
            path: '/:path',
            url: `/${ROUTE_PARTS.RESOURCE}`
        }

    };

    const breadcrumbItemDataProps: BreadcrumbItemDataProps = {
        hostName
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...routerprops,
            ...breadcrumbItemDataProps,
            ...overrides
        };

        return <BreadcrumbItem {...props}/>;
    };

    context('snapshot', () => {
        it('matches snapshot', () => {
            const wrapper = testWithLocalizationContext(
                getComponent()
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('matches snapshot when rendering devices links', () => {
            const wrapper = testWithLocalizationContext(
                getComponent({
                    history: {
                        location,
                    },
                    location,
                    match: {
                        isExact: false,
                        path: `/${ROUTE_PARTS.RESOURCE}/${hostName}/:path`,
                        url: `/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}`
                    }
                })
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('matches snapshot when rendering module identity links', () => {
            const newPathName = `/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/${ROUTE_PARTS.MODULE_IDENTITY}/${ROUTE_PARTS.MODULE_DETAIL}/`;
            const newLocation = {
                pathname: newPathName,
                search: '?deviceId=newdevice"&moduleId=ca'
            };
            const wrapper = testWithLocalizationContext(
                getComponent({
                    history: {
                        newLocation,
                    },
                    location: newLocation,
                    match: {
                        isExact: false,
                        path: `/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/:path`,
                        url: `/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/${ROUTE_PARTS.MODULE_IDENTITY}`
                    }
                })
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('matches snapshot when rendering last breadcrumb', () => {
            const wrapper = testWithLocalizationContext(
                getComponent({
                    history: {
                        location,
                    },
                    location,
                    match: {
                        isExact: true,
                        path: `/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/:path`,
                        url: `/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}/`
                    }
                })
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
