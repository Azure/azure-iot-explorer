/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import SettingsPane from './settingsPane';

describe('settingsPane', () => {
    it('matches snapshot', () => {
        expect(shallow(<SettingsPane/>)).toMatchSnapshot();
    });
});
