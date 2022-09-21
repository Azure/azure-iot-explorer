/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { DeviceEventsStateContextProvider } from './deviceEventsStateProvider';
import { getInitialDeviceEventsState } from '../state';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';

describe('DeviceEventsStateContextProvider', ()=> {
    jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([getInitialDeviceEventsState(), jest.fn()]);

    it('matches snapshot', () => {
        const component = <DeviceEventsStateContextProvider>
            <span>test</span>
        </DeviceEventsStateContextProvider>;
        expect(shallow(component)).toMatchSnapshot();
    });
});
