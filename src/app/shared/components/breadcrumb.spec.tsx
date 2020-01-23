/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow } from 'enzyme';
import Breadcrumb, { BreadcrumbItemDataProps } from './breadcrumb';
import { ROUTE_PARTS } from '../../constants/routes';

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
        hostName,
        ...routerprops
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...routerprops,
            ...breadcrumbItemDataProps,
            ...overrides
        };

        return <Breadcrumb {...props}/>;
    };

    context('snapshot', () => {
        it('matches snapshot', () => {
            expect(shallow(getComponent())).toMatchSnapshot();
        });
    });
});
