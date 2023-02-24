/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ListItemLocalLabel } from './listItemLocalLabel';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('ListItemLocalLabel', () => {
    it('matches snapshot when repo type equals Local', () => {
        const wrapper = shallow(
            <ListItemLocalLabel repoType={REPOSITORY_LOCATION_TYPE.Local}/>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when repo type equals LocalDMR', () => {
        const wrapper = shallow(
            <ListItemLocalLabel repoType={REPOSITORY_LOCATION_TYPE.LocalDMR}/>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
