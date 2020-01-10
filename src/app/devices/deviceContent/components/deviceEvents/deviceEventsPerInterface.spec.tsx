/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import DeviceEventsPerInterfaceComponent, { DeviceEventsDataProps, DeviceEventsDispatchProps, TelemetrySchema, DeviceEventsState } from './deviceEventsPerInterface';
import { mountWithLocalization, testSnapshot } from '../../../../shared/utils/testHelpers';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import ErrorBoundary from '../../../errorBoundary';
import { appConfig, HostMode } from '../../../../../appConfig/appConfig';

describe('components/devices/deviceEventsPerInterface', () => {

    const pathname = `#/devices/detail/events/?id=device1`;

    const location: any = { // tslint:disable-line:no-any
        pathname
    };
    const routerProps: any = { // tslint:disable-line:no-any
        history: {
            location
        },
        location,
        match: {}
    };

    const refreshMock = jest.fn();
    const deviceEventsDispatchProps: DeviceEventsDispatchProps = {
        refresh: refreshMock,
        setInterfaceId: jest.fn()
    };

    const deviceEventsDataProps: DeviceEventsDataProps = {
        connectionString: 'testString',
        interfaceName: 'environmentalSensor',
        isLoading: true,
        telemetrySchema: []
    };

    const getComponent = (overrides = {}) => {
        const props = {
            connectionString: '',
            ...deviceEventsDispatchProps,
            ...deviceEventsDataProps,
            ...routerProps,
            ...overrides,
        };
        return <DeviceEventsPerInterfaceComponent {...props} />;
    };

    const telemetrySchema: TelemetrySchema[] = [{
        parsedSchema: {
            description: 'Temperature /Current temperature on the device',
            title: 'temp',
            type: 'number'
        },
        telemetryModelDefinition: {
            '@type': 'Telemetry',
            'description': 'Current temperature on the device',
            'displayName': 'Temperature',
            'name': 'humid',
            'schema': 'double'
        }
    }];

    it('renders Shimmer while loading', () => {
        const wrapper = mountWithLocalization(getComponent());
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot while interface cannot be found', () => {
        testSnapshot(getComponent({isLoading: false, telemetrySchema: undefined}));
        const wrapper = mountWithLocalization(getComponent(), true);
        expect(wrapper.find(InterfaceNotFoundMessageBoxContainer)).toBeDefined();
    });

    it('matches snapshot while interface definition is retrieved in electron', () => {
        appConfig.hostMode = HostMode.Electron;
        testSnapshot(getComponent({isLoading: false, telemetrySchema}));
    });

    it('matches snapshot while interface definition is retrieved in hosted environment', () => {
        appConfig.hostMode = HostMode.Browser;
        testSnapshot(getComponent({isLoading: false, telemetrySchema}));
    });

    it('renders events which body\'s value type is wrong with expected columns', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}));
        const events = [{
            body: {
                humid: '123' // intentionally set a value which type is double
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            properties: {
              'iothub-message-schema': 'humid'
            }
        }];
        wrapper.setState({events});
        wrapper.update();
        const errorBoundary = wrapper.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('humid (Temperature)');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('double'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(3).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props['aria-label']).toEqual('deviceEvents.columns.error.value.label'); // tslint:disable-line:no-magic-numbers
    });

    it('renders events which body\'s key name is wrong with expected columns', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}));
        const events = [{
            body: {
                'non-matching-key': 0
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            properties: {
              'iothub-message-schema': 'humid'
            }
        }];
        wrapper.setState({events});
        wrapper.update();
        const errorBoundary = wrapper.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('humid (Temperature)');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('double'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(3).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props['aria-label']).toEqual('deviceEvents.columns.error.key.label'); // tslint:disable-line:no-magic-numbers
    });

    it('renders events which body\'s key name is not populated', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}));
        const events = [{
            body: {
                'non-matching-key': 0
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            properties: {}
        }];
        wrapper.setState({events});
        wrapper.update();
        const errorBoundary = wrapper.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('--');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(3).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props['aria-label']).toEqual('deviceEvents.columns.error.key.label'); // tslint:disable-line:no-magic-numbers
    });

    it('changes state accordingly when command bar buttons are clicked', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}));
        const commandBar = wrapper.find(CommandBar).first();
        // click the start button
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).hasMore).toBeTruthy();

        // click the start button again which has been toggled to stop button
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).hasMore).toBeFalsy();

        // click the refresh button
        commandBar.props().items[1].onClick(null);
        wrapper.update();
        expect(refreshMock).toBeCalled();

        // click the clear events button
        commandBar.props().items[2].onClick(null); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).events).toEqual([]);
    });

    it('changes state accordingly when consumer group value is changed', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}));
        const textField = wrapper.find(TextField).first();
        textField.instance().props.onChange({ target: null}, 'testGroup');
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).consumerGroup).toEqual('testGroup');
    });
});
