/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ModelRepositoryLocationList } from './modelRepositoryLocationList';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';

describe('ModelRepositoryLocationList', () => {
    jest.mock('react-movable', () => ({
        List: ({ children }) => <div>{children}</div>,
        arrayMove: jest.fn(),
    }));

    it('matches snapshot with no items', () => {
        const component = (
            <ModelRepositoryLocationList
                formState={[{...getInitialModelRepositoryFormState(), repositoryLocationSettings: []}, getInitialModelRepositoryFormOps()]}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });
    it('matches snapshot with all items', () => {
        const component = (
            <ModelRepositoryLocationList
                formState={[{...getInitialModelRepositoryFormState(), repositoryLocationSettings: [
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public, value: '' },
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable, value: 'test.com' },
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'd:/myModels' },
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.LocalDMR, value: 'c:/dtmi' }
                ]}, getInitialModelRepositoryFormOps()]}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });
});
