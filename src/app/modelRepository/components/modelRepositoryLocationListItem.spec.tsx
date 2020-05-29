/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Dialog from 'office-ui-fabric-react/lib/Dialog';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import * as Utils from '../../shared/utils/utils';

describe('components/settings/modelRepositoryLocationListItem', () => {
    it('matches snapshot for public', () => {
        const wrapper = mount(
            <ModelRepositoryLocationListItem
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
                }}
                onChangeRepositoryLocationSettingValue={jest.fn()}
                onRemoveRepositoryLocationSetting={jest.fn()}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot for local', () => {
        const wrapper = mount(
            <ModelRepositoryLocationListItem
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: 'f:/'
                }}
                onChangeRepositoryLocationSettingValue={jest.fn()}
                onRemoveRepositoryLocationSetting={jest.fn()}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot for local with error', () => {
        const wrapper = mount(
            <ModelRepositoryLocationListItem
                errorKey={'error'}
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: 'f:/'
                }}
                onChangeRepositoryLocationSettingValue={jest.fn()}
                onRemoveRepositoryLocationSetting={jest.fn()}
            />
        );
        expect(wrapper).toMatchSnapshot();

    });
    it('renders no folder text when no sub folder is retrieved', () => {
        jest.spyOn(Utils, 'getRootFolder').mockReturnValue(null);

        const wrapper = mount(
            <ModelRepositoryLocationListItem
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: 'f:/'
                }}
                onChangeRepositoryLocationSettingValue={jest.fn()}
                onRemoveRepositoryLocationSetting={jest.fn()}
            />
        );
        const button = wrapper.find('.local-folder-launch').first();
        button.simulate('click');
        wrapper.update();

        let dialog = wrapper.find(Dialog).first();
        expect(dialog.children().props().hidden).toBeFalsy();
        expect(dialog.children().props().children[0].props.children[0].props.disabled).toBeTruthy();
        expect(dialog.children().props().children[0].props.children[1].props.children).toEqual(ResourceKeys.modelRepository.types.local.folderPicker.dialog.noFolderFoundText);

        wrapper.setState({showFolderPicker: true, showError: true});
        wrapper.update();
        dialog = wrapper.find(Dialog).first();
        expect(dialog.children().props().children[0].props.children[1].props.children).toStrictEqual(ResourceKeys.modelRepository.types.local.folderPicker.dialog.error);
        expect(dialog.children().props().children[1].props.children[0].props.disabled).toBeTruthy();
    });

    it('renders folders when sub folders retrieved', () => {
        jest.spyOn(Utils, 'getRootFolder').mockReturnValue(null);

        const wrapper = mount(
            <ModelRepositoryLocationListItem
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: 'f:/'
                }}
                onChangeRepositoryLocationSettingValue={jest.fn()}
                onRemoveRepositoryLocationSetting={jest.fn()}
            />
        );
        const subFolders = ['documents', 'pictures'];
        wrapper.setState({showFolderPicker: true, subFolders});
        wrapper.update();
        const dialog = wrapper.find(Dialog).first();
        expect(dialog.children().props().hidden).toBeFalsy();
        expect(dialog.children().props().children[0].props.children[0].props.text).toEqual(ResourceKeys.modelRepository.types.local.folderPicker.command.navigateToParent);
        expect(dialog.children().props().children[0].props.children[0].props.disabled).toBeFalsy();
        expect(dialog.children().props().children[0].props.children[1].length).toEqual(subFolders.length);
        expect(dialog.children().props().children[0].props.children[1][0].props.text).toEqual(subFolders[0]);
    });
});
