/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import RepositoryLocationList from './repositoryLocationList';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { testSnapshot } from '../../shared/utils/testHelpers';

describe('components/settings/repositoryLocationList', () => {

    it('matches snapshot with no items', () => {
        const component = (
            <RepositoryLocationList
                items={null}
                onAddListItem={jest.fn()}
                onMoveItem={jest.fn()}
                onPrivateRepositoryConnectionStringChanged={jest.fn()}
                onRemoveListItem={jest.fn()}
            />
        );
        testSnapshot(component);
    });
    it('matches snapshot with public item', () => {
        const component = (
            <RepositoryLocationList
                items={[{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public}]}
                onAddListItem={jest.fn()}
                onMoveItem={jest.fn()}
                onPrivateRepositoryConnectionStringChanged={jest.fn()}
                onRemoveListItem={jest.fn()}
            />
        );
        testSnapshot(component);
    });

    it('matches snapshot with each type item', () => {
        const component = (
            <RepositoryLocationList
                items={[
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public},
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Device},
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Private}
                ]}
                onAddListItem={jest.fn()}
                onMoveItem={jest.fn()}
                onPrivateRepositoryConnectionStringChanged={jest.fn()}
                onRemoveListItem={jest.fn()}
            />
        );
        testSnapshot(component);
    });
});
