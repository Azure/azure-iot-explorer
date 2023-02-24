/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { IconButton } from '@fluentui/react';
import { act } from 'react-dom/test-utils';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';

describe('ModelRepositoryLocationListItem', () => {
    it('matches snapshot for public repo', () => {
        const wrapper = shallow(
            <ModelRepositoryLocationListItem
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
                    value: ''
                }}
                formState={[getInitialModelRepositoryFormState(), getInitialModelRepositoryFormOps()]}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot for configurable repo', () => {
        const wrapper = shallow(
            <ModelRepositoryLocationListItem
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

    it('matches snapshot for local folder', () => {
        const wrapper = shallow(
            <ModelRepositoryLocationListItem
                index={2}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: 'c:/models'
                }}
                formState={[getInitialModelRepositoryFormState(), getInitialModelRepositoryFormOps()]}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot for local repo', () => {
        const wrapper = shallow(
            <ModelRepositoryLocationListItem
                index={3}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.LocalDMR,
                    value: 'c:/dtmi'
                }}
                formState={[getInitialModelRepositoryFormState(), getInitialModelRepositoryFormOps()]}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('remove item calls expected operations', () => {
        const setRepositoryLocationSettings = jest.fn();
        const setDirtyFlag = jest.fn();
        const wrapper = shallow(
            <ModelRepositoryLocationListItem
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
                    value: ''
                }}
                formState={[getInitialModelRepositoryFormState(), {...getInitialModelRepositoryFormOps(), setRepositoryLocationSettings, setDirtyFlag}]}
            />
        );
        const removeButton = wrapper.find(IconButton).first();
        act(() => removeButton.props().onClick(undefined));

        expect(setRepositoryLocationSettings).toBeCalledWith([]);
        expect(setDirtyFlag).toBeCalledWith(true);
    });
});
