/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { ConnectionStringsEmpty } from './connectionStringsEmpty'

describe('ConnectionSTringsEmpty', () => {
    it('matches snapshot', () => {
        expect(shallow(<ConnectionStringsEmpty/>)).toMatchSnapshot();
    });
});
