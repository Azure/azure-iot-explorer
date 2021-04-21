/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Dialog } from 'office-ui-fabric-react';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import * as Utils from '../../shared/utils/utils';

describe('components/settings/modelRepositoryLocationListItem', () => {
    it('matches snapshot for public', () => {
        const wrapper = shallow(
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
        const wrapper = shallow(
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
        const wrapper = shallow(
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
        jest.spyOn(Utils, 'getRootFolder').mockReturnValue('f:/');

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

        act(() => wrapper.find('.local-folder-launch').first().props().onClick(undefined));
        wrapper.update();

        const dialog = wrapper.find(Dialog).first();
        expect(dialog.children().props().hidden).toBeFalsy();
        expect(dialog.children().props().children[0].props.children[0].props.disabled).toBeTruthy();
        expect(dialog.children().props().children[0].props.children[1].props.children).toEqual(ResourceKeys.modelRepository.types.local.folderPicker.dialog.noFolderFoundText);
    });

    it('renders folders when sub folders retrieved', () => {
        const subFolders = ['documents', 'pictures'];
        jest.spyOn(Utils, 'getRootFolder').mockReturnValue('d:/');

        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(subFolders));

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

        act(() => wrapper.find('.local-folder-launch').first().props().onClick(null));
        wrapper.update();

        const dialog = wrapper.find(Dialog).first();
        expect(dialog.children().props().hidden).toBeFalsy();
        expect(dialog.children().props().children[0].props.children[0].props.text).toEqual(ResourceKeys.modelRepository.types.local.folderPicker.command.navigateToParent);
        expect(dialog.children().props().children[0].props.children[0].props.disabled).toBeFalsy();
        expect(dialog.children().props().children[0].props.children[1].length).toEqual(subFolders.length);
        expect(dialog.children().props().children[0].props.children[1][0].props.text).toEqual(subFolders[0]);
    });
});
