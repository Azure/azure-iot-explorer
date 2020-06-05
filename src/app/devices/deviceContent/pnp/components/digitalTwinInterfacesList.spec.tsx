/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { Pivot } from 'office-ui-fabric-react/lib/Pivot';
import { DigitalTwinInterfacesList } from './digitalTwinInterfacesList';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { pnpStateInitial, PnpStateInterface } from '../state';
import { pnpStateWithTestData, testDigitalTwin } from './testData';

const pathname = 'resources/TestHub.azure-devices.net/devices/deviceDetail/ioTPlugAndPlay/?deviceId=testDevice';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn()}),
    useLocation: () => ({ search: '?deviceId=testDevice' }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('DigitalTwinInterfacesList', () => {
    it('shows shimmer when model id is not retrieved', () => {
        const initialState: PnpStateInterface = {
            ...pnpStateInitial(),
            digitalTwin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        };
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([initialState, jest.fn()]);

        const wrapper = mount(<DigitalTwinInterfacesList/>);
        expect(wrapper.find(MultiLineShimmer)).toHaveLength(1);
    });

    it('shows model id with no model definition found', () => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([pnpStateWithTestData, jest.fn()]);

        const wrapper = mount(<DigitalTwinInterfacesList/>);
        const labels = wrapper.find(Label);
        expect(labels).toHaveLength(1);
        expect(labels.first().props().children).toEqual(ResourceKeys.digitalTwin.modelId);

        const h4 = wrapper.find('h4');
        expect(h4).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(h4.at(1).props().children).toEqual(ResourceKeys.digitalTwin.steps.secondFailure);
    });

    it('shows model id with null model definition found', () => {
        const initialState: PnpStateInterface = {
            ...pnpStateInitial(),
            digitalTwin: {
                payload: testDigitalTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            modelDefinitionWithSource: {
                payload: {
                    isModelValid: false,
                    modelDefinition: null,
                    source: REPOSITORY_LOCATION_TYPE.Local
                },
                synchronizationStatus: SynchronizationStatus.fetched
            }
        };
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([initialState, jest.fn()]);

        const wrapper = mount(<DigitalTwinInterfacesList/>);

        const h4 = wrapper.find('h4');
        expect(h4).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(h4.at(1).props().children).toEqual(ResourceKeys.digitalTwin.steps.secondSuccess);

        const labels = wrapper.find(Label);
        expect(labels).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(labels.at(1).props().children).toEqual([ResourceKeys.deviceInterfaces.columns.source, ': ', ResourceKeys.modelRepository.types.local.label]);

        const messageBar = wrapper.find(MessageBar);
        expect(messageBar).toHaveLength(1);
        expect(messageBar.first().props().children).toEqual(ResourceKeys.deviceInterfaces.interfaceNotValid);
    });

    it('shows model id with valid model definition found but has no component', () => {
        const initialState: PnpStateInterface = {
            ...pnpStateInitial(),
            digitalTwin: {
                payload: testDigitalTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            modelDefinitionWithSource: {
                payload: {
                    isModelValid: true,
                    modelDefinition: {
                        '@context': 'dtmi:dtdl:context;2',
                        '@id': 'dtmi:plugnplay:hube2e:cm;1',
                        '@type': 'Interface',
                        'contents': [],
                        'displayName': 'IoT Hub E2E Tests',
                    },
                    source: REPOSITORY_LOCATION_TYPE.Public
                },
                synchronizationStatus: SynchronizationStatus.fetched
            }
        };
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([initialState, jest.fn()]);
        const wrapper = mount(<DigitalTwinInterfacesList/>);

        const h4 = wrapper.find('h4');
        expect(h4).toHaveLength(3); // tslint:disable-line:no-magic-numbers
        expect(h4.at(2).props().children).toEqual(ResourceKeys.digitalTwin.steps.third); // tslint:disable-line:no-magic-numbers
        expect(wrapper.find('h5').first().props().children).toEqual(ResourceKeys.digitalTwin.steps.explanation);

        const labels = wrapper.find(Label);
        expect(labels).toHaveLength(3); // tslint:disable-line:no-magic-numbers
        expect(labels.at(1).props().children).toEqual([ResourceKeys.deviceInterfaces.columns.source, ': ', ResourceKeys.modelRepository.types.public.label]);

        expect(wrapper.find(Announced)).toHaveLength(1);
        expect(wrapper.find(Pivot)).toHaveLength(1);
    });

    it('shows model id with valid model definition found and has components', () => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([pnpStateWithTestData, jest.fn()]);
        const wrapper = mount(<DigitalTwinInterfacesList/>);

        expect(wrapper.find(Announced)).toHaveLength(0);

        const labels = wrapper.find(Label);
        expect(labels).toHaveLength(5); // tslint:disable-line:no-magic-numbers
        expect(labels.at(1).props().children).toEqual([ResourceKeys.deviceInterfaces.columns.source, ': ', ResourceKeys.modelRepository.types.local.label]);
        expect(labels.at(2).props().children).toEqual('dtmi:__DeviceManagement:DeviceInformation;1'); // tslint:disable-line:no-magic-numbers
        expect(labels.at(3).props().children).toEqual('dtmi:__Client:SDKInformation;1'); // tslint:disable-line:no-magic-numbers
        expect(labels.at(4).props().children).toEqual('dtmi:__Contoso:EnvironmentalSensor;1'); // tslint:disable-line:no-magic-numbers
    });
});
