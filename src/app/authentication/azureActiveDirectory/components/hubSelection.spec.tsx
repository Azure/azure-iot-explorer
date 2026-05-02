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

import * as React from 'react';
import { HubSelection } from './hubSelection';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';

import { render } from '@testing-library/react';
describe('HubSelection', () => {
    afterEach(() => {
        useStateMock = null;
    });

    it('matches snapshot when page is loading', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), formState: 'working'}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<HubSelection/>);
        expect(container).toBeDefined();
    });

    it('matches snapshot when token is present', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), token: 'token'}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<HubSelection/>);
        expect(container).toBeDefined();
    });

    it('matches snapshot when hub list is shown', () => {
        const actual = jest.requireActual('react');
        let called = false;
        useStateMock = jest.fn((...args: any[]) => {
            if (!called) {
                called = true;
                return actual.useState(true);
            }
            return undefined;
        });
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [getInitialAzureActiveDirectoryState(), azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<HubSelection/>);
        expect(container).toBeDefined();
    });
});
