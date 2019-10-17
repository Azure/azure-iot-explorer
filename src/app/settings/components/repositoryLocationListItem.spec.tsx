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

    it('matches snapshot for private', () => {
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
    it('matches snapshot for public', () => {
        const wrapper = testWithLocalizationContext(
            <RepositoryLocationListItem
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
                }}
                moveCard={jest.fn()}
                onPrivateRepositoryConnectionStringChanged={jest.fn()}
                onRemoveListItem={jest.fn()}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot for device', () => {
        const wrapper = testWithLocalizationContext(
            <RepositoryLocationListItem
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Device,
                }}
                moveCard={jest.fn()}
                onPrivateRepositoryConnectionStringChanged={jest.fn()}
                onRemoveListItem={jest.fn()}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
