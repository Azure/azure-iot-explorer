/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import * as Redux from 'react-redux';
import { shallow, mount } from 'enzyme';
import { AzureResourceViewContainer, AzureResourceViewContainerProps } from './azureResourceViewContainer';

describe('AzureResourceViewContainer', () => {
    it('matches snapshot', () => {
        jest.spyOn(Redux, 'useSelector').mockImplementation(() => 'active azure resource');
        jest.spyOn(Redux, 'useDispatch').mockImplementation(jest.fn());

        const routerprops: AzureResourceViewContainerProps = {
            history: jest.fn() as any, // tslint:disable-line:no-any
            location: jest.fn() as any, // tslint:disable-line:no-any
            match: {
                params: {
                    hostName: 'hostName'
                },
                url: 'currentUrl',
            } as any // tslint:disable-line:no-any
        };

        expect(shallow(
            <AzureResourceViewContainer {...routerprops} />
        )).toMatchSnapshot();
    });
});
