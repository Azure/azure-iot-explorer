/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import {  } from 'enzyme';
import { validateRepositoryLocationSettings } from './commands';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';

describe('validateRepositoryLocationSettings', () => {
    it('adds validation error when local repository lacks value', () => {
        const result = validateRepositoryLocationSettings([
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: ''}
        ]);

        expect(result[REPOSITORY_LOCATION_TYPE.Local]).toEqual(ResourceKeys.modelRepository.types.mandatory);
    });

    it('passes public repository', () => {
        const result = validateRepositoryLocationSettings([
            {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public, value: ''}
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
