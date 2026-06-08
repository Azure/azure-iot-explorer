/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { validateRepositoryLocationSettings } from './commands';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../localization/resourceKeys';

import { render } from '@testing-library/react';
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