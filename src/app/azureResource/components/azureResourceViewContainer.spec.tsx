/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import * as Redux from 'react-redux';
import { shallow } from 'enzyme';
import { AzureResourceViewContainer } from './azureResourceViewContainer';

describe('AzureResourceViewContainer', () => {
    it('matches snapshot', () => {
        jest.spyOn(Redux, 'useSelector').mockImplementation(() => 'active azure resource');
        jest.spyOn(Redux, 'useDispatch').mockImplementation(jest.fn());

        expect(shallow(
            <AzureResourceViewContainer />
        )).toMatchSnapshot();
    });
});
