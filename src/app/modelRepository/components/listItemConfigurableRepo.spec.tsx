/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ListItemConfigurableRepo } from './listItemConfigurableRepo';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';

describe('ListItemConfigurableRepo', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(
            <ListItemConfigurableRepo
                index={1}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable,
                    value: 'test.com'
                }}
                formState={[getInitialModelRepositoryFormState(), getInitialModelRepositoryFormOps()]}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
