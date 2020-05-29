/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow } from 'enzyme';
import { BreadcrumbItem } from './breadcrumb';
import { ROUTE_PARTS } from '../../constants/routes';

const hostName = 'hub.azure-devices.net';
const pathname = `/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}/`;

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname, search: '?deviceId=newdevice'}),
    useRouteMatch: () => ({ url: `/${ROUTE_PARTS.RESOURCE}`})
}));

describe('Breadcrumb', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            const wrapper = shallow(<BreadcrumbItem hostName={hostName}/>);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
