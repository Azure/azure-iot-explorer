/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DigitaltwinPnpConfigurationSteps } from './digitaltwinPnpConfigurationSteps';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../../../shared/contexts/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const interfaceId = 'urn:azureiot:samplemodel;1';

const pathname = 'resources/TestHub.azure-devices.net/devices/deviceDetail/ioTPlugAndPlay/?deviceId=testDevice';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn()}),
    useLocation: () => ({ search: '?deviceId=testDevice' }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('DigitaltwinPnpConfigurationSteps', () => {
    it('matches snapshot when there is empty model id', () => {
        /* tslint:disable */
        const deviceTwin: any = {
            "deviceId": "testDevice",
            "modelId": "",
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
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: deviceTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            modelDefinitionWithSource: {
                payload: null,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = shallow(<DigitaltwinPnpConfigurationSteps/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when there is model id', () => {
        /* tslint:disable */
        const deviceTwin: any = {
            "deviceId": "testDevice",
            "modelId": "modelId",
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
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: deviceTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            modelDefinitionWithSource: {
                payload: null,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = shallow(<DigitaltwinPnpConfigurationSteps/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when empty model id is retrieved', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: {
                    deviceId: 'testDevice',
                    moduleId: ''
                } as any,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = shallow(<DigitaltwinPnpConfigurationSteps/>);
        expect(wrapper).toMatchSnapshot();
    });
});
