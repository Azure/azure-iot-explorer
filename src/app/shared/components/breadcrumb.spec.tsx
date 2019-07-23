/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import Breadcrumb from './breadcrumb';

describe('components/shared/breadcrumb', () => {
    const testWithLocalizationContext = (Target: JSX.Element) => {
        const outerWrapper = shallow(Target);
        const Children = outerWrapper.props().children;
        const t = jest.fn((value: string, options: unknown) => {
            return value;
        });
        return shallow(<Children t={t}/>);
    };

    const getRouterProps = (pathname: string, search?: string) => {
        const location: any = { // tslint:disable-line:no-any
            pathname,
            search
        };
        const routerprops: any = { // tslint:disable-line:no-any
            history: {
                location,
            },
            location,
            match: {
                params: {
                }
            }
        };
        return routerprops;
    };
    it('matches snapshot #/', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot #/devices/', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/devices/')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot #/devices.../device1', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/devices/details/identity/', 'id=device1')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot #/devices.../device1 with interface', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/devices/detail/digitalTwins/properties/', 'id=device1&interfaceId=urn:some:interface:name:1')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot with missing #/devices.../device1', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/devices/details/identity/')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot #/devices.../device1 missing interface', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/devices/detail/digitalTwins/properties', 'id=device1')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot with malformed #/devices.../device1', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/devices/details/identity', 'id=')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot #/devices.../device1 with malformed interface', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/devices/detail/digitalTwins/properties', 'id=device1&interfaceid=')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot #/devices.../device1 with interface and missing deviceId', () => {
        const wrapper = testWithLocalizationContext(
            <Breadcrumb
                hubName="foo.azure-devices.net"
                {...getRouterProps('#/devices/detail/digitalTwins/properties/', 'interfaceId=urn:some:interface:name:1')}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
