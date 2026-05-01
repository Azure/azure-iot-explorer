/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Dialog } from '@fluentui/react-components';
import { ListItemLocal } from './listItemLocal';
import * as Utils from '../../shared/utils/utils';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';
import { ResourceKeys } from '../../../localization/resourceKeys';

describe('ListItemLocal', () => {
    it('matches snapshot for local folder', () => {
        const wrapper = shallow(
            <ListItemLocal
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: 'c:/models'
                }}
                repoType={REPOSITORY_LOCATION_TYPE.Local}
                formState={[getInitialModelRepositoryFormState(), getInitialModelRepositoryFormOps()]}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });


    it('renders no folder text when no sub folder is retrieved', () => {
        jest.spyOn(Utils, 'getRootFolder').mockReturnValue('c:/models');

        const wrapper = mount(
            <ListItemLocal
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: 'c:/models'
                }}
                repoType={REPOSITORY_LOCATION_TYPE.Local}
                formState={[getInitialModelRepositoryFormState(), getInitialModelRepositoryFormOps()]}
            />
        );

        act(() => wrapper.find('.local-folder-launch').first().props().onClick(undefined));
        wrapper.update();

        const dialog = wrapper.find(Dialog).first();
        expect(dialog.props().open).toBeTruthy();
    });

    it('renders folders when sub folders retrieved', () => {
        const subFolders = ['documents', 'pictures'];
        jest.spyOn(Utils, 'getRootFolder').mockReturnValue('d:/');

        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(subFolders));

        const wrapper = mount(
            <ListItemLocal
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: 'c:/models'
                }}
                repoType={REPOSITORY_LOCATION_TYPE.Local}
                formState={[getInitialModelRepositoryFormState(), getInitialModelRepositoryFormOps()]}
            />
        );

        act(() => wrapper.find('.local-folder-launch').first().props().onClick(null));
        wrapper.update();

        const dialog = wrapper.find(Dialog).first();
        expect(dialog.props().open).toBeTruthy();
    });
});
