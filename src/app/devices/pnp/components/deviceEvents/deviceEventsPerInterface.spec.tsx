/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Shimmer } from 'office-ui-fabric-react/lib/components/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { TextField } from 'office-ui-fabric-react/lib/components/TextField';
import { DeviceEventsPerInterface } from './deviceEventsPerInterface';
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { appConfig, HostMode } from '../../../../../appConfig/appConfig';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { DEFAULT_CONSUMER_GROUP } from '../../../../constants/apiConstants';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import * as PnpContext from '../../../../shared/contexts/pnpStateContext';
import { testModelDefinition } from './testData';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

const pathname = `#/devices/detail/events/?id=device1`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?id=device1', pathname }),
}));

describe('components/devices/deviceEventsPerInterface', () => {
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
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({pnpState, dispatch: jest.fn(), getModelDefinition: getModelDefinitionMock});
    };

    beforeEach(() => {
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
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        const wrapper = mount(<DeviceEventsPerInterface/>);
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
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        expect(shallow(<DeviceEventsPerInterface/>)).toMatchSnapshot();
    });

    it('matches snapshot while interface definition is retrieved in electron', () => {
        appConfig.hostMode = HostMode.Electron;
        mockFetchedState();
        expect(shallow(<DeviceEventsPerInterface/>)).toMatchSnapshot();
    });

    it('matches snapshot while interface definition is retrieved in hosted environment', () => {
        appConfig.hostMode = HostMode.Browser;
        mockFetchedState();
        expect(shallow(<DeviceEventsPerInterface/>)).toMatchSnapshot();
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
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(DEFAULT_CONSUMER_GROUP));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(events));
        mockFetchedState();
        const wrapper = mount(<DeviceEventsPerInterface/>);
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
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(DEFAULT_CONSUMER_GROUP));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(events));
        mockFetchedState();
        const wrapper = mount(<DeviceEventsPerInterface/>);

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
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(DEFAULT_CONSUMER_GROUP));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(events));
        mockFetchedState();

        const wrapper = shallow(<DeviceEventsPerInterface/>);
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
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(DEFAULT_CONSUMER_GROUP));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(events));
        mockFetchedState();

        const wrapper = shallow(<DeviceEventsPerInterface/>);
        const errorBoundary = wrapper.find(ErrorBoundary);
        expect(errorBoundary.children().at(1).props().children.props.children).toEqual('--');
        expect(errorBoundary.children().at(2).props().children.props.children).toEqual('--'); // tslint:disable-line:no-magic-numbers
        expect(errorBoundary.children().at(4).props().children.props.children).toEqual(JSON.stringify(events[0].body, undefined, 2)); // tslint:disable-line:no-magic-numbers
    });

    it('changes state accordingly when command bar buttons are clicked', () => {
        mockFetchedState();
        const wrapper = shallow(<DeviceEventsPerInterface/>);
        const commandBar = wrapper.find(CommandBar).first();
        // click the start button
        act(() => commandBar.props().items[0].onClick());
        wrapper.update();
        expect(wrapper.find('.device-events-container').first().props().hasMore).toBeTruthy();

        // click the start button again which has been toggled to stop button
        act(() => wrapper.find(CommandBar).first().props().items[0].onClick());
        wrapper.update();
        expect(wrapper.find('.device-events-container').first().props().hasMore).toBeFalsy();

        // click the refresh button
        act(() => commandBar.props().items[1].onClick());
        wrapper.update();
        expect(getModelDefinitionMock).toBeCalled();

        // click the clear events button
        act(() => commandBar.props().items[2].onClick()); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        // tslint:disable-next-line: no-magic-numbers
        expect(wrapper.find(CommandBar).first().props().items[2].disabled).toBeTruthy();
    });

    it('changes state accordingly when consumer group value is changed', () => {
        mockFetchedState();
        const wrapper = shallow(<DeviceEventsPerInterface/>);
        const textField = wrapper.find(TextField).first();
        act(() => textField.props().onChange({ target: null}, 'testGroup'));
        wrapper.update();

        expect(wrapper.find(TextField).first().props().value).toEqual('testGroup');
    });
});
