/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import RepositoryLocationListItem from './repositoryLocationListItem';
import { testWithLocalizationContext } from '../../shared/utils/testHelpers';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('components/settings/repositoryLocationListItem', () => {

    it('matches snapshot', () => {
        const wrapper = testWithLocalizationContext(
            <RepositoryLocationListItem
                index={0}
                item={{
                    connectionString: '',
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Private,
                }}
                moveCard={jest.fn()}
                onPrivateRepositoryConnectionStringChanged={jest.fn()}
                onRemoveListItem={jest.fn()}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
