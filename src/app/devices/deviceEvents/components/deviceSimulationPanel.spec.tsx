/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DeviceSimulationPanel } from './deviceSimulationPanel';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: `?deviceId=device1` })
}));

describe('deviceSimulationPanel', () => {
        it('matches snapshot ', () => {
            expect(shallow(
            <DeviceSimulationPanel
                showSimulationPanel={true}
                onToggleSimulationPanel={jest.fn()}
            />)).toMatchSnapshot();
        });
});
