/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { ListItemConfigurableRepo } from './listItemConfigurableRepo';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';

import { render } from '@testing-library/react';
describe('ListItemConfigurableRepo', () => {
    it('matches snapshot', () => {
        const { container } = render(
            <ListItemConfigurableRepo
                index={1}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable,
                    value: 'test.com'
                }}
                formState={[getInitialModelRepositoryFormState(), getInitialModelRepositoryFormOps()]}
            />
        );
        expect(container).toBeDefined();
    });
});
