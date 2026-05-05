/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DigitalTwinInterfacesList } from './digitalTwinInterfacesList';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const interfaceId = 'urn:azureiot:samplemodel;1';

const deviceTwin: any = {
    deviceId: 'testDevice',
    modelId: interfaceId,
    properties: {
        desired: { environmentalSensor: { brightness: 456, __t: 'c' } },
        reported: { environmentalSensor: { brightness: { value: 123, dv: 2 }, __t: 'c' } }
    }
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' }),
    useNavigate: () => jest.fn(),
}));

describe('DigitalTwinInterfacesList', () => {
    it('renders header text', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: { payload: deviceTwin, synchronizationStatus: SynchronizationStatus.fetched },
            modelDefinitionWithSource: { payload: null, synchronizationStatus: SynchronizationStatus.fetched }
        });
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        render(<DigitalTwinInterfacesList/>);

        expect(screen.getByText('digitalTwin.headerText')).toBeInTheDocument();
    });

    it('renders configuration steps when not loading', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: { payload: deviceTwin, synchronizationStatus: SynchronizationStatus.fetched },
            modelDefinitionWithSource: { payload: null, synchronizationStatus: SynchronizationStatus.fetched }
        });
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const { container } = render(<DigitalTwinInterfacesList/>);

        // Should not show shimmer when not loading
        expect(container.querySelector('.multi-line-shimmer')).toBeNull();
    });
});