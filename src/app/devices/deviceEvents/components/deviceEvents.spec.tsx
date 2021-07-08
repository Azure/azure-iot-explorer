/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { TextField, CommandBar, Shimmer } from '@fluentui/react';
import { DeviceEvents } from './deviceEvents';
import { DEFAULT_CONSUMER_GROUP } from '../../../constants/apiConstants';
import { startEventsMonitoringAction } from '../actions';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as pnpStateContext from '../../../shared/contexts/pnpStateContext';
import { pnpStateInitial, PnpStateInterface } from '../../pnp/state';
import { testModelDefinition } from '../../pnp/components/deviceEvents/testData';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';
import { ErrorBoundary } from '../../shared/components/errorBoundary';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import * as TransformHelper from '../../../api/dataTransforms/transformHelper';

const pathname = `#/devices/detail/events/?id=device1`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: `?deviceId=device1`, pathname, push: jest.fn() })
}));

describe('deviceEvents', () => {
    describe('deviceEvents in non-pnp context', () => {
        const events = [{
            body: {
                humid: 123
            },
            enqueuedTime: 'Wed Feb 17 2021 16:06:00 GMT-0800 (Pacific Standard Time)',
            properties: {
            'iothub-message-schema': 'humid'
            }
        }];

        beforeEach(() => {
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{
                payload: events,
                synchronizationStatus: SynchronizationStatus.fetched
            }, jest.fn()]);

            const realUseState = React.useState;
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(DEFAULT_CONSUMER_GROUP));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(undefined));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(undefined));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(undefined));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(TransformHelper, 'parseDateTimeString').mockImplementationOnce(parameters => {
                return '9:44:58 PM, 10/14/2019';
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        it('matches snapshot', () => {
            expect(shallow(<DeviceEvents/>)).toMatchSnapshot();
        });

        it('changes state accordingly when command bar buttons are clicked', () => {
            const wrapper = mount(<DeviceEvents/>);
            const commandBar = wrapper.find(CommandBar).first();
            // tslint:disable-next-line: no-magic-numbers
            expect(commandBar.props().items.length).toEqual(4);

            // click the start button
            const startEventsMonitoringSpy = jest.spyOn(startEventsMonitoringAction, 'started');
            act(() => commandBar.props().items[0].onClick(null));
            wrapper.update();
            expect(startEventsMonitoringSpy.mock.calls[0][0]).toEqual({
                consumerGroup: DEFAULT_CONSUMER_GROUP,
                deviceId: 'device1',
                moduleId: null,
                startListeners: true,
                startTime: undefined
            });
        });

        it('changes state accordingly when consumer group value is changed', () => {
            const wrapper = mount(<DeviceEvents/>);
            const textField = wrapper.find(TextField).first();
            act(() => textField.props().onChange(undefined, 'testGroup'));
            wrapper.update();
            expect(wrapper.find(TextField).first().props().value).toEqual('testGroup');
        });

        it('renders events', () => {
            jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: pnpStateInitial(), dispatch: jest.fn()});
            const wrapper = mount(<DeviceEvents/>);
            const rawTelemetry = wrapper.find('article');
            expect(rawTelemetry).toHaveLength(1);
        });
    });

    describe('deviceEvents in pnp context', () => {
        const getModelDefinitionMock = jest.fn();

        const mockFetchedState = () => {
            const pnpState: PnpStateInterface = {
                ...pnpStateInitial(),
                modelDefinitionWithSource: {
                    payload: {
                        isModelValid: true,
                        modelDefinition: testModelDefinition,
                        source: REPOSITORY_LOCATION_TYPE.Public,
                    },
                    synchronizationStatus: SynchronizationStatus.fetched
                }
            };
            jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({pnpState, dispatch: jest.fn(), getModelDefinition: getModelDefinitionMock});
        };

        beforeEach(() => {
            const realUseState = React.useState;
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(DEFAULT_CONSUMER_GROUP));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(undefined));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(undefined));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(undefined));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(false));
            jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(true));
            jest.spyOn(TransformHelper, 'parseDateTimeString').mockImplementationOnce(parameters => {
                return '9:44:58 PM, 10/14/2019';
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        it('renders Shimmer while loading', () => {
            const pnpState: PnpStateInterface = {
                ...pnpStateInitial(),
                modelDefinitionWithSource: {
                    synchronizationStatus: SynchronizationStatus.working
                }
            };
            jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValueOnce({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
            const wrapper = mount(<DeviceEvents/>);
            expect(wrapper.find(Shimmer)).toBeDefined();
        });

        it('matches snapshot while interface cannot be found', () => {
            const pnpState: PnpStateInterface = {
                ...pnpStateInitial(),
                modelDefinitionWithSource: {
                    payload: null,
                    synchronizationStatus: SynchronizationStatus.fetched
                }
            };
            jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValueOnce({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
            expect(shallow(<DeviceEvents/>)).toMatchSnapshot();
        });

        it('matches snapshot while interface definition is retrieved', () => {
            mockFetchedState();
            expect(shallow(<DeviceEvents/>)).toMatchSnapshot();
        });

        it('renders events which body\'s value type is wrong with expected columns', () => {
            const events = [{
                body: {
                    humid: '123' // intentionally set a value which type is double
                },
                enqueuedTime: 'Wed Feb 17 2021 16:06:00 GMT-0800 (Pacific Standard Time)',
                systemProperties: {
                'iothub-message-schema': 'humid'
                }
            }];
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{
                payload: events,
                synchronizationStatus: SynchronizationStatus.fetched
            }, jest.fn()]);
            mockFetchedState();

            const wrapper = mount(<DeviceEvents/>);
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
                enqueuedTime: 'Wed Feb 17 2021 16:06:00 GMT-0800 (Pacific Standard Time)',
                systemProperties: {
                'iothub-message-schema': 'humid'
                }
            }];
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{
                payload: events,
                synchronizationStatus: SynchronizationStatus.fetched
            }, jest.fn()]);
            mockFetchedState();

            const wrapper = mount(<DeviceEvents/>);
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
                enqueuedTime: 'Wed Feb 17 2021 16:06:00 GMT-0800 (Pacific Standard Time)',
                systemProperties: {}
            }];
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{
                payload: events,
                synchronizationStatus: SynchronizationStatus.fetched
            }, jest.fn()]);
            mockFetchedState();

            const wrapper = shallow(<DeviceEvents/>);
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
                enqueuedTime: 'Wed Feb 17 2021 16:06:00 GMT-0800 (Pacific Standard Time)'
            }];
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{
                payload: events,
                synchronizationStatus: SynchronizationStatus.fetched
            }, jest.fn()]);
            mockFetchedState();

            const wrapper = shallow(<DeviceEvents/>);
            const errorBoundary = wrapper.find(ErrorBoundary);
            expect(errorBoundary.children().at(1).props().children.props.children).toEqual('--');
            expect(errorBoundary.children().at(2).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
            expect(errorBoundary.children().at(4).props().children.props.children).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        });
    });
});
