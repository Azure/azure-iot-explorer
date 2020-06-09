/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { DeviceInterfaces } from './deviceInterfaces';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import * as PnpContext from '../../../../shared/contexts/pnpStateContext';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ pathname: '/devices', search: '' }),
}));

describe('deviceInterfaces', () => {
    /* tslint:disable */
    const modelDefinition = {
        "@id": "urn:azureiot:ModelDiscovery:DigitalTwin:1",
        "@type": "Interface",
        "contents": [
            {
                "@type": "Property",
                "name": "modelInformation",
                "displayName": "Model Information",
                "description": "Providing model and optional interfaces information on a digital twin.",
                "schema": {
                    "@type": "Object",
                    "fields": [
                        {
                            "name": "modelId",
                            "schema": "string"
                        },
                        {
                            "name": "interfaces",
                            "schema": {
                                "@type": "Map",
                                "mapKey": {
                                    "name": "name",
                                    "schema": "string"
                                },
                                "mapValue": {
                                    "name": "schema",
                                    "schema": "string"
                                }
                            }
                        }
                    ]
                }
            }
        ],
        "@context": "http://azureiot.com/v1/contexts/Interface.json"
    };
    /* tslint:enable */

    const initialState: PnpStateInterface = {
        ...pnpStateInitial(),
        modelDefinitionWithSource: {
            payload: {
                isModelValid: true,
                modelDefinition,
                source: REPOSITORY_LOCATION_TYPE.Public,
            },
            synchronizationStatus: SynchronizationStatus.fetched
        }
    };

    it('shows Shimmer when status is working', () => {
        const pnpState = {
            ...pnpStateInitial(),
            modelDefinitionWithSource: {
                synchronizationStatus: SynchronizationStatus.working
            }
        };
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState , dispatch: jest.fn(), getModelDefinition: jest.fn()});
        const wrapper = shallow(<DeviceInterfaces/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('shows interface information when status is fetched', () => {
        const getModelDefinitionSpy = jest.fn();
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState: initialState , dispatch: jest.fn(), getModelDefinition: getModelDefinitionSpy});
        const wrapper = shallow(<DeviceInterfaces/>);
        expect(wrapper).toMatchSnapshot();

        const command = wrapper.find(CommandBar);
        act(() => command.props().items[0].onClick(null));
        expect(getModelDefinitionSpy).toBeCalled();
    });
});
