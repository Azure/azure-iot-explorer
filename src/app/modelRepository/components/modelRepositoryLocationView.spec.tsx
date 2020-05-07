/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { ModelRepositoryLocationViewContainer, ModelRepositoryLocationView, validateRepositoryLocationSettings } from './modelRepositoryLocationView';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';

describe('modelRepositoryLocationView', () => {
    it('matches snapshot when no locations', () => {
        expect(shallow(
            <ModelRepositoryLocationView
                repositoryLocationSettings={[]}
                onSaveRepositoryLocationSettings={jest.fn()}
                onNavigateBack={jest.fn()}
            />
        )).toMatchSnapshot();
    });

    it('matches snapshot when locations greater than 0', () => {
        expect(shallow(
            <ModelRepositoryLocationView
                repositoryLocationSettings={[{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public}]}
                onSaveRepositoryLocationSettings={jest.fn()}
                onNavigateBack={undefined}
            />
        )).toMatchSnapshot()
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
