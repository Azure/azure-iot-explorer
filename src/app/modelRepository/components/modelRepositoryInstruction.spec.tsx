/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { ModelRepositoryInstruction } from './modelRepositoryInstruction';

describe('ModelRepositoryInstruction', () => {
    it('matches snapshot', () => {
        expect(shallow(<ModelRepositoryInstruction empty={true}/>)).toMatchSnapshot();
        expect(shallow(<ModelRepositoryInstruction empty={false}/>)).toMatchSnapshot();
    });
});
