/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as pnpStateContext from '../../../shared/contexts/pnpStateContext';
import { ErrorBoundary } from '../../shared/components/errorBoundary';
import { pnpStateInitial, PnpStateInterface } from '../../pnp/state';
import { testModelDefinition } from '../../pnp/components/deviceEvents/testData';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';
import { EventsContent } from './eventsContent';

const pathname = `#/devices/detail/events/?id=device1`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: `?deviceId=device1`, pathname, push: jest.fn() })
}));

describe('EventsContent', () => {
    describe('EventsContent in non-pnp context', () => {
        const events = [{
            body: {
                humid: 123
            },
            enqueuedTime: 'Wed Feb 17 2021 16:06:00 GMT-0800 (Pacific Standard Time)',
            properties: {
            'iothub-message-schema': 'humid'
            }
        }];

        it('matches snapshot', () => {
            const startEventsMonitoring = jest.fn();
            jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
                [{...getInitialDeviceEventsState(), message: events},
                    {...deviceEventsStateContext.getInitialDeviceEventsOps(), startEventsMonitoring}]);
            expect(shallow(<EventsContent showPnpModeledEvents={false} showSystemProperties={false}/>)).toMatchSnapshot();
        });

        it('renders events', () => {
            jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
                [{...getInitialDeviceEventsState(), message: events},
                    {...deviceEventsStateContext.getInitialDeviceEventsOps()}]);
            jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: pnpStateInitial(), dispatch: jest.fn()});
            const wrapper = mount(<EventsContent showPnpModeledEvents={false} showSystemProperties={false}/>);
            const rawTelemetry = wrapper.find('article');
            expect(rawTelemetry).toHaveLength(1);
        });
    });

    describe('EventsContent in pnp context', () => {
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

        it('matches snapshot while interface definition is retrieved', () => {
            mockFetchedState();
            expect(shallow(<EventsContent showPnpModeledEvents={true} showSystemProperties={false}/>)).toMatchSnapshot();
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
            jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
                [{...getInitialDeviceEventsState(), message: events, formMode: 'fetched'},
                    {...deviceEventsStateContext.getInitialDeviceEventsOps()}]);
            mockFetchedState();

            const wrapper = mount(<EventsContent showPnpModeledEvents={true} showSystemProperties={false}/>);
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
            mockFetchedState();
            jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
                [{...getInitialDeviceEventsState(), message: events, formMode: 'fetched'},
                    {...deviceEventsStateContext.getInitialDeviceEventsOps()}]);
            mockFetchedState();

            const wrapper = mount(<EventsContent showPnpModeledEvents={true} showSystemProperties={false}/>);
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
            jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
                [{...getInitialDeviceEventsState(), message: events, formMode: 'fetched'},
                    {...deviceEventsStateContext.getInitialDeviceEventsOps()}]);
            mockFetchedState();

            const wrapper = shallow(<EventsContent showPnpModeledEvents={true} showSystemProperties={false}/>);
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
            jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
                [{...getInitialDeviceEventsState(), message: events, formMode: 'fetched'},
                    {...deviceEventsStateContext.getInitialDeviceEventsOps()}]);
            mockFetchedState();

            const wrapper = shallow(<EventsContent showPnpModeledEvents={true} showSystemProperties={false}/>);
            const errorBoundary = wrapper.find(ErrorBoundary);
            expect(errorBoundary.children().at(1).props().children.props.children).toEqual('--');
            expect(errorBoundary.children().at(2).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
            expect(errorBoundary.children().at(4).props().children.props.children).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
        });
    });
});