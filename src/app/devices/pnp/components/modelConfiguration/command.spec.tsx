/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import 'jest';
 import * as React from 'react';
 import { shallow } from 'enzyme';
 import { Command } from './command';
 import * as pnpStateContext from '../../context/pnpStateContext';
 import { PnpStateInterface, pnpStateInitial } from '../../state';
 import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
 
 const search = '?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1;1';
 const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/${search}`;
 jest.mock('react-router-dom', () => ({
     useLocation: () => ({ search, pathname })
 }));
 
 describe('Command', () => {
     it('matches snapshot', () => {
         const initialState: PnpStateInterface = pnpStateInitial().merge({
             twin: {
                 synchronizationStatus: SynchronizationStatus.working
             }
         });
         jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});
         expect(shallow(<Command/>)).toMatchSnapshot();
     });
 });
 