/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { ModelRepositoryLocationView, } from './view';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import * as ModelRepositoryContext from '../shared/modelRepository/context/modelRepositoryStateContext';
import { getInitialModelRepositoryState } from '../shared/modelRepository/state';
import { getInitialModelRepositoryActions } from '../shared/modelRepository/interface';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '' }),
    useRouteMatch: () => ({ url: 'url', path: 'path'})
}));

describe('view', () => {
    it('matches snapshot when no locations', () => {
        jest.spyOn(ModelRepositoryContext, 'useModelRepositoryContext').mockReturnValueOnce([getInitialModelRepositoryState(), getInitialModelRepositoryActions()]);
        expect(shallow(<ModelRepositoryLocationView/>)).toMatchSnapshot();
    });

    it('matches snapshot when locations greater than 0', () => {
        const initialState = [
            ...getInitialModelRepositoryState(),
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable,
                value: 'd:/'
            }
        ];
        jest.spyOn(ModelRepositoryContext, 'useModelRepositoryContext').mockReturnValueOnce([initialState, getInitialModelRepositoryActions()]);
        expect(shallow(<ModelRepositoryLocationView/>)).toMatchSnapshot();
    });
});

