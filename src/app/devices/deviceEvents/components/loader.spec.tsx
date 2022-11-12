/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Loader } from './loader';

describe('Loader', () => {
    it('matches snapshot when loading', () => {
        expect(shallow(<Loader monitoringData={true}/>)).toMatchSnapshot();
    });

    it('matches snapshot when not loading', () => {
        expect(shallow(<Loader monitoringData={false}/>)).toMatchSnapshot();
    });
});