/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Container } from 'react-smooth-dnd';
import { ModelRepositoryLocationList } from './modelRepositoryLocationList';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('components/settings/modelRepositoryLocationList', () => {

    it('matches snapshot with no items', () => {
        const component = (
            <ModelRepositoryLocationList
                repositoryLocationSettings={null}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={jest.fn()}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });
    it('matches snapshot with public item', () => {
        const component = (
            <ModelRepositoryLocationList
                repositoryLocationSettings={[{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public}]}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={jest.fn()}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });

    it('matches snapshot with each type item', () => {
        const component = (
            <ModelRepositoryLocationList
                repositoryLocationSettings={[
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,},
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local}
                ]}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={jest.fn()}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });

    it('calls onChangeRepositoryLocationSettings when location value changes', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <ModelRepositoryLocationList
                repositoryLocationSettings={[
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'folder'},
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public},
                ]}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={spy}
            />
        );

        wrapper.find(ModelRepositoryLocationListItem).first().props().onChangeRepositoryLocationSettingValue(0, 'newFolder');
        expect(spy).toHaveBeenCalledWith([
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'newFolder'},
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public},
           ]);
    });

    it('calls onChangeRepositoryLocationSettings when location removed', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <ModelRepositoryLocationList
                repositoryLocationSettings={[
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'folder'},
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public},
                ]}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={spy}
            />
        );

        wrapper.find(ModelRepositoryLocationListItem).first().props().onRemoveRepositoryLocationSetting(0);
        expect(spy).toHaveBeenCalledWith([
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public},
        ]);
    });

    it('calls onChangeRepositoryLocationSettings when location dropped', () => {
        const spy = jest.fn();
        const wrapper = mount(
            <ModelRepositoryLocationList
                repositoryLocationSettings={[
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'folder'},
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public},
                ]}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={spy}
            />
        );

        wrapper.find(Container).first().props().onDrop({addedIndex: 0, removedIndex: 1});
        expect(spy).toHaveBeenCalledWith([
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public},
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'folder'}
        ]);
    });
});
