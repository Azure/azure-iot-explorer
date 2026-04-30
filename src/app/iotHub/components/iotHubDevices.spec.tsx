/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { IotHubDevices } from './iotHubDevices';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('IotHubDevices', () => {
    it('matches snapshot', () => {
        expect(shallow(<IotHubDevices/>)).toMatchSnapshot();
    });
});
