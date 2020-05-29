/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DeviceEventsPerInterfaceComponent, DeviceEventsDataProps, DeviceEventsDispatchProps, TelemetrySchema, DeviceEventsState } from './deviceEventsPerInterface';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';
import { InterfaceNotFoundMessageBar } from '../shared/interfaceNotFoundMessageBar';
import ErrorBoundary from '../../../errorBoundary';
import { appConfig, HostMode } from '../../../../../appConfig/appConfig';
import { ResourceKeys } from '../../../../../localization/resourceKeys';

const pathname = `#/devices/detail/events/?id=device1`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?id=device1', pathname }),
}));

describe('components/devices/deviceEventsPerInterface', () => {
    const refreshMock = jest.fn();
    const deviceEventsDispatchProps: DeviceEventsDispatchProps = {
        addNotification: jest.fn(),
        refresh: refreshMock,
        setComponentName: jest.fn()
    };

    const deviceEventsDataProps: DeviceEventsDataProps = {
        connectionString: 'testString',
        isLoading: true,
        telemetrySchema: []
    };

    const getComponent = (overrides = {}) => {
        const props = {
            connectionString: '',
            ...deviceEventsDispatchProps,
            ...deviceEventsDataProps,
            ...overrides,
        };
        return <DeviceEventsPerInterfaceComponent {...props} />;
    };

    const telemetrySchema: TelemetrySchema[] = [{
        parsedSchema: {
            description: 'Temperature /Current temperature on the device',
            required: [],
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
        const wrapper = mount(getComponent());
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot while interface cannot be found', () => {
        expect(shallow(getComponent({isLoading: false, telemetrySchema: undefined}))).toMatchSnapshot();
        const wrapper = mountWithLocalization(getComponent(), true);
        expect(wrapper.find(InterfaceNotFoundMessageBar)).toBeDefined();
    });

    it('matches snapshot while interface definition is retrieved in electron', () => {
        appConfig.hostMode = HostMode.Electron;
        expect(shallow(getComponent({isLoading: false, telemetrySchema}))).toMatchSnapshot();
    });

    it('matches snapshot while interface definition is retrieved in hosted environment', () => {
        appConfig.hostMode = HostMode.Browser;
        expect(shallow(getComponent({isLoading: false, telemetrySchema}))).toMatchSnapshot();
    });

    it('renders events which body\'s value type is wrong with expected columns', () => {
        const wrapper = mount(getComponent({isLoading: false, telemetrySchema}));
        const events = [{
            body: {
                humid: '123' // intentionally set a value which type is double
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            systemProperties: {
              'iothub-message-schema': 'humid'
            }
        }];
        let deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        deviceEventsPerInterfaceComponent.setState({events});
        wrapper.update();
        deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        const errorBoundary = deviceEventsPerInterfaceComponent.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('humid (Temperature)');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('double'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props['aria-label']).toEqual(ResourceKeys.deviceEvents.columns.validation.value.label); // tslint:disable-line:no-magic-numbers
    });

    it('renders events which body\'s key name is wrong with expected columns', () => {
        const wrapper = mount(getComponent({isLoading: false, telemetrySchema}));
        const events = [{
            body: {
                'non-matching-key': 0
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            systemProperties: {
              'iothub-message-schema': 'humid'
            }
        }];
        let deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        deviceEventsPerInterfaceComponent.setState({events});
        wrapper.update();
        deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        const errorBoundary = deviceEventsPerInterfaceComponent.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('humid (Temperature)');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('double'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props.className).toEqual('value-validation-error'); // tslint:disable-line:no-magic-numbers
    });

    it('renders events when body is exploded and schema is not provided in system properties', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}), false, true);
        const events = [{
            body: {
                'humid': 0,
                'humid-foo': 'test'
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            systemProperties: {}
        }];
        let deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        deviceEventsPerInterfaceComponent.setState({events});
        wrapper.update();
        deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        let errorBoundary = deviceEventsPerInterfaceComponent.find(ErrorBoundary).first();
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('humid (Temperature)');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('double'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify({humid: 0}, undefined, 2)); // tslint:disable-line:no-magic-numbers

        errorBoundary = deviceEventsPerInterfaceComponent.find(ErrorBoundary).at(1);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('--');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify({'humid-foo': 'test'}, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props.className).toEqual('value-validation-error'); // tslint:disable-line:no-magic-numbers
    });

    it('renders events which body\'s key name is not populated', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}), false, true);
        const events = [{
            body: {
                'non-matching-key': 0
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z'
        }];
        let deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        deviceEventsPerInterfaceComponent.setState({events});
        wrapper.update();
        deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        const errorBoundary = deviceEventsPerInterfaceComponent.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('--');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
    });

    it('changes state accordingly when command bar buttons are clicked', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}), false, true);
        let deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        const commandBar = deviceEventsPerInterfaceComponent.find(CommandBar).first();
        // click the start button
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        expect((deviceEventsPerInterfaceComponent.state() as DeviceEventsState).hasMore).toBeTruthy();

        // click the start button again which has been toggled to stop button
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        expect((deviceEventsPerInterfaceComponent.state() as DeviceEventsState).hasMore).toBeFalsy();

        // click the refresh button
        commandBar.props().items[1].onClick(null);
        wrapper.update();
        expect(refreshMock).toBeCalled();

        // click the clear events button
        commandBar.props().items[2].onClick(null); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        expect((deviceEventsPerInterfaceComponent.state() as DeviceEventsState).events).toEqual([]);
    });

    it('changes state accordingly when consumer group value is changed', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: false, telemetrySchema}), false, true);
        const textField = wrapper.find(TextField).first();
        textField.instance().props.onChange({ target: null}, 'testGroup');
        wrapper.update();
        const deviceEventsPerInterfaceComponent = wrapper.find(DeviceEventsPerInterfaceComponent);
        expect((deviceEventsPerInterfaceComponent.state() as DeviceEventsState).consumerGroup).toEqual('testGroup');
    });
});
