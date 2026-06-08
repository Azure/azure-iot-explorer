/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import 'jest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
 import * as React from 'react';
import { render } from '@testing-library/react';
  import { Command } from './command';
import { render } from '@testing-library/react';
 import * as pnpStateContext from '../../context/pnpStateContext';
import { render } from '@testing-library/react';
 import { PnpStateInterface, pnpStateInitial } from '../../state';
import { render } from '@testing-library/react';
 import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
 
import { render } from '@testing-library/react';
 const search = '?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1;1';
 const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/${search}`;
 jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
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
         expect(render(<MemoryRouter><Command /></MemoryRouter>)).toBeDefined();
     });
 });
 