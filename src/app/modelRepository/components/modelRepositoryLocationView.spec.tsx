/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { ModelRepositoryLocationView, validateRepositoryLocationSettings } from './modelRepositoryLocationView';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import * as GlobalStateContext from '../../shared/contexts/globalStateContext';
import { globalStateInitial } from '../../shared/global/state';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '' }),
}));

describe('modelRepositoryLocationView', () => {
    it('matches snapshot when no locations', () => {
        jest.spyOn(GlobalStateContext, 'useGlobalStateContext').mockReturnValueOnce({globalState: globalStateInitial(), dispatch: jest.fn()});
        expect(shallow(<ModelRepositoryLocationView/>)).toMatchSnapshot();
    });

    it('matches snapshot when locations greater than 0', () => {
        const initialState = globalStateInitial().merge({
            modelRepositoryState: {
                localFolderSettings: { path: '' },
                repositoryLocations: [ REPOSITORY_LOCATION_TYPE.Local ]
            }
        });
        jest.spyOn(GlobalStateContext, 'useGlobalStateContext').mockReturnValueOnce({globalState: initialState, dispatch: jest.fn()});
        expect(shallow(<ModelRepositoryLocationView/>)).toMatchSnapshot();
    });
});

describe('validateRepositoryLocationSettings', () => {
    it('adds validation error when local repository lacks value', () => {
        const result = validateRepositoryLocationSettings([
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local}
        ]);

        expect(result[REPOSITORY_LOCATION_TYPE.Local]).toEqual(ResourceKeys.modelRepository.types.local.folderPicker.errors.mandatory);
    });

    it('passes public repository', () => {
        const result = validateRepositoryLocationSettings([
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public}
        ]);

        expect(result[REPOSITORY_LOCATION_TYPE.Public]).toBeFalsy();
    });

    it('passes validation when local validation has value', () => {
        const result = validateRepositoryLocationSettings([
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'value'}
        ]);

        expect(result[REPOSITORY_LOCATION_TYPE.Local]).toBeFalsy();
    });
});
