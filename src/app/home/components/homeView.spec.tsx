/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { HomeView } from './homeView';

describe('HomeView', () => {
    it('matches snapshot', () => {
        const routeProps = {
            history: jest.fn() as any, // tslint:disable-line:no-any
            location: jest.fn() as any, // tslint:disable-line:no-any
            match: jest.fn() as any, // tslint:disable-line:no-any
        };

        expect(shallow(<HomeView {...routeProps} />)).toMatchSnapshot();
    });
});
