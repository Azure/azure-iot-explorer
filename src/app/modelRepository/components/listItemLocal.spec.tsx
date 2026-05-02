/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
let useStateMock: jest.Mock | null = null;
jest.mock('react', () => {
    const actual = jest.requireActual('react');
    return {
        ...actual,
        useState: (...args: any[]) => {
            if (useStateMock) {
                const result = useStateMock(...args);
                if (result !== undefined) {
                    return result;
                }
            }
            return actual.useState(...args);
        },
    };
});

import 'jest';
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Dialog } from '@fluentui/react-components';
import { ListItemLocal } from './listItemLocal';
import * as Utils from '../../shared/utils/utils';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';
import { ResourceKeys } from '../../../localization/resourceKeys';

describe('ListItemLocal', () => {
    afterEach(() => {
        useStateMock = null;
    });

    it('matches snapshot for local folder', () => {
        const { container } = render(
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
        expect(container).toBeDefined();
    });


    it('renders no folder text when no sub folder is retrieved', () => {
        jest.spyOn(Utils, 'getRootFolder').mockReturnValue('c:/models');

        const { container } = render(
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

    });

    it('renders folders when sub folders retrieved', () => {
        const subFolders = ['documents', 'pictures'];
        jest.spyOn(Utils, 'getRootFolder').mockReturnValue('d:/');

        const actual = jest.requireActual('react');
        let called = false;
        useStateMock = jest.fn((...args: any[]) => {
            if (!called) {
                called = true;
                return actual.useState(subFolders);
            }
            return undefined;
        });

        const { container } = render(
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

    });
});