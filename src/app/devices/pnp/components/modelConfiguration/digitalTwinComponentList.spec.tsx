/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Announced, Pivot, PivotItem } from '@fluentui/react';
import { DigitalTwinComponentList } from './digitalTwinComponentList';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const interfaceId = 'urn:azureiot:samplemodel;1';

/* tslint:disable */
const deviceTwin: any = {
    "deviceId": "testDevice",
    "modelId": interfaceId,
    "properties" : {
        desired: {
            environmentalSensor: {
                brightness: 456,
                __t: 'c'
            }
        },
        reported: {
            environmentalSensor: {
                brightness: {
                    value: 123,
                    dv: 2
                },
                __t: 'c'
            }
        }
    }
};
/* tslint:enable */

const pathname = 'resources/TestHub.azure-devices.net/devices/deviceDetail/ioTPlugAndPlay/?deviceId=testDevice';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn()}),
    useLocation: () => ({ search: '?deviceId=testDevice' }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('DigitalTwinComponentList', () => {
    it('matches snapshot when empty model id is retrieved', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: {
                    deviceId: 'testDevice',
                    moduleId: ''
                } as any,
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
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = shallow(<DigitalTwinComponentList/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('shows model id with valid model definition found but has no component', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: deviceTwin,
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
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});
        const wrapper = mount(<DigitalTwinComponentList/>);

        expect(wrapper.find(Announced)).toHaveLength(1);
        expect(wrapper.find(Pivot)).toHaveLength(1);
    });

    it('shows model id with valid model definition found and has components', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: deviceTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            modelDefinitionWithSource: {
                payload: {
                    isModelValid: true,
                    modelDefinition: {
                        '@context': 'dtmi:dtdl:context;2',
                        '@id': 'dtmi:plugnplay:hube2e:cm;1',
                        '@type': 'Interface',
                        'contents': [
                            {
                                '@type': 'Component',
                                'name': 'deviceInformation',
                                'schema': 'dtmi:__DeviceManagement:DeviceInformation;1'
                            },
                            {
                                '@type': 'Component',
                                'name': 'sdkInfo',
                                'schema': 'dtmi:__Client:SDKInformation;1'
                            },
                            {
                                '@type': 'Component',
                                'name': 'environmentalSensor',
                                'schema': 'dtmi:__Contoso:EnvironmentalSensor;1'
                            }
                        ],
                        'displayName': 'IoT Hub E2E Tests',
                    },
                    source: REPOSITORY_LOCATION_TYPE.Public
                },
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});
        const wrapper = shallow(<DigitalTwinComponentList/>);

        expect(wrapper.find(Announced)).toHaveLength(0);

        const list = wrapper.find('.component-list');
        expect((list.props() as any).items[0].interfaceId).toEqual('dtmi:__DeviceManagement:DeviceInformation;1'); // tslint:disable-line:no-any
        expect((list.props() as any).items[1].interfaceId).toEqual('dtmi:__Client:SDKInformation;1'); // tslint:disable-line:no-magic-numbers, no-any
        expect((list.props() as any).items[2].interfaceId).toEqual('dtmi:__Contoso:EnvironmentalSensor;1'); // tslint:disable-line:no-magic-numbers, no-any

        // tslint:disable-next-line: no-magic-numbers
        expect(wrapper.find(PivotItem)).toHaveLength(2);
    });
});
