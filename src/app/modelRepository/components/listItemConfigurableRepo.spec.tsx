/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ListItemConfigurableRepo } from './listItemConfigurableRepo';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';
import { act } from 'react-dom/test-utils';
import { TextField } from '@fluentui/react';

describe('ListItemConfigurableRepo', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(
            <ListItemConfigurableRepo
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

    it('calls actions with expected params', () => {
        const setDirtyFlag = jest.fn();
        const setRepositoryLocationSettings = jest.fn();
        const wrapper = shallow(
            <ListItemConfigurableRepo
                index={0}
                item={{
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable,
                    value: 'test.com'
                }}
                formState={[{...getInitialModelRepositoryFormState(), repositoryLocationSettings: [{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable, value: 'old.com'}]},
                    {...getInitialModelRepositoryFormOps(), setDirtyFlag, setRepositoryLocationSettings}]}
            />
        );
        act(() => wrapper.find(TextField).props().onChange?.(undefined as any, 'test.com'));
        expect(setDirtyFlag).toBeCalledWith(true);
        expect(setRepositoryLocationSettings).toBeCalledWith([{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable, value: 'test.com'}])
    });
});
