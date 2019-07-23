/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import RepositoryLocationList from './repositoryLocationList';
import { LocalizationContextProvider } from '../../shared/contexts/localizationContext';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('components/settings/repositoryLocationList', () => {

    it('matches snapshot with no items', () => {
        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
                <RepositoryLocationList
                    items={null}
                    onAddListItem={jest.fn()}
                    onMoveItem={jest.fn()}
                    onPrivateRepositoryConnectionStringChanged={jest.fn()}
                    onRemoveListItem={jest.fn()}
                />
            </LocalizationContextProvider>
        );
        expect(mount(wrapper)).toMatchSnapshot();
    });
    it('matches snapshot with public item', () => {
        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
                <RepositoryLocationList
                    items={[{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public}]}
                    onAddListItem={jest.fn()}
                    onMoveItem={jest.fn()}
                    onPrivateRepositoryConnectionStringChanged={jest.fn()}
                    onRemoveListItem={jest.fn()}
                />
            </LocalizationContextProvider>
        );
        expect(mount(wrapper)).toMatchSnapshot();
    });

    it('matches snapshot with each type item', () => {
        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
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
            </LocalizationContextProvider>
        );
        expect(mount(wrapper)).toMatchSnapshot();
    });
});
