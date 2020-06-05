/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
const InfiniteScroll =  require('react-infinite-scroller');
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DeviceEventsPerInterfaceComponent, DeviceEventsDataProps, DeviceEventsDispatchProps, TelemetrySchema, DeviceEventsState } from './deviceEventsPerInterface';
import { InterfaceNotFoundMessageBar } from '../../../components/shared/interfaceNotFoundMessageBar';
import ErrorBoundary from '../../../../errorBoundary';
import { appConfig, HostMode } from '../../../../../../appConfig/appConfig';
import { ResourceKeys } from '../../../../../../localization/resourceKeys';
import { MILLISECONDS_IN_MINUTE } from '../../../../../constants/shared';
import { SynchronizationStatus } from '../../../../../api/models/synchronizationStatus';
import { DEFAULT_CONSUMER_GROUP } from '../../../../../constants/apiConstants';

const initialState = {
    consumerGroup: DEFAULT_CONSUMER_GROUP,
    events: [],
    hasMore: false,
    loading: false,
    loadingAnnounced: undefined,
    monitoringData: false,
    showRawEvent: false,
    startTime: new Date(new Date().getTime() - MILLISECONDS_IN_MINUTE), // set start time to one minute ago
    synchronizationStatus: SynchronizationStatus.initialized
};

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
        const wrapper = mount(getComponent());
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
        const events = [{
            body: {
                humid: '123' // intentionally set a value which type is double
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            systemProperties: {
              'iothub-message-schema': 'humid'
            }
        }];

        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState({ ...initialState, events }));

        const wrapper = shallow(getComponent({isLoading: false, telemetrySchema}));
        const errorBoundary = wrapper.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('humid (Temperature)');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('double'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props['aria-label']).toEqual(ResourceKeys.deviceEvents.columns.validation.value.label); // tslint:disable-line:no-magic-numbers
    });

    it('renders events which body\'s key name is wrong with expected columns', () => {
        const events = [{
            body: {
                'non-matching-key': 0
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            systemProperties: {
              'iothub-message-schema': 'humid'
            }
        }];
        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState({ ...initialState, events }));
        const wrapper = shallow(getComponent({isLoading: false, telemetrySchema}));

        const errorBoundary = wrapper.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('humid (Temperature)');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('double'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props.className).toEqual('value-validation-error'); // tslint:disable-line:no-magic-numbers
    });

    it('renders events when body is exploded and schema is not provided in system properties', () => {
        const events = [{
            body: {
                'humid': 0,
                'humid-foo': 'test'
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            systemProperties: {}
        }];
        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState({ ...initialState, events }));
        const wrapper = shallow(getComponent({isLoading: false, telemetrySchema}));

        let errorBoundary = wrapper.find(ErrorBoundary).first();
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('humid (Temperature)');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('double'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify({humid: 0}, undefined, 2)); // tslint:disable-line:no-magic-numbers

        errorBoundary = wrapper.find(ErrorBoundary).at(1);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('--');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[0]).toEqual(JSON.stringify({'humid-foo': 'test'}, undefined, 2)); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children[1].props.className).toEqual('value-validation-error'); // tslint:disable-line:no-magic-numbers
    });

    it('renders events which body\'s key name is not populated', () => {
        const events = [{
            body: {
                'non-matching-key': 0
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z'
        }];

        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState({ ...initialState, events }));
        const wrapper = shallow(getComponent({isLoading: false, telemetrySchema}));

        const errorBoundary = wrapper.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('--');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
    });

    it('changes state accordingly when command bar buttons are clicked', () => {
        const wrapper = shallow(getComponent({isLoading: false, telemetrySchema}));
        const commandBar = wrapper.find(CommandBar).first();
        // click the start button
        act(() => commandBar.props().items[0].onClick());
        wrapper.update();
        expect(wrapper.find(InfiniteScroll).first().props().hasMore).toBeTruthy();

        // click the start button again which has been toggled to stop button
        act(() => wrapper.find(CommandBar).first().props().items[0].onClick());
        wrapper.update();
        expect(wrapper.find(InfiniteScroll).first().props().hasMore).toBeFalsy();

        // click the refresh button
        act(() => commandBar.props().items[1].onClick());
        wrapper.update();
        expect(refreshMock).toBeCalled();

        // click the clear events button
        act(() => commandBar.props().items[2].onClick()); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        expect(wrapper.find(CommandBar).first().props().items[2].disabled).toBeTruthy();
    });

    it('changes state accordingly when consumer group value is changed', () => {
        const wrapper = shallow(getComponent({isLoading: false, telemetrySchema}));
        const textField = wrapper.find(TextField).first();
        act(() => textField.props().onChange({ target: null}, 'testGroup'));
        wrapper.update();

        expect(wrapper.find(TextField).first().props().value).toEqual('testGroup');
    });
});
