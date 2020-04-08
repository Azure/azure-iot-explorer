/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { AzureResourcesContainer } from './azureResourcesContainer';

describe('azureResourcesContainer', () => {
    it('matches snapshot', () => {

        const routerprops = {
            history: jest.fn() as any, // tslint:disable-line:no-any
            location: jest.fn() as any, // tslint:disable-line:no-any
            match: {
                params: {
                    hostName: 'hostName'
                },
                url: 'currentUrl',
            } as any // tslint:disable-line:no-any
        };
        const wrapper = shallow(<AzureResourcesContainer {...routerprops} />);
        expect(wrapper).toMatchSnapshot();
    });
});
