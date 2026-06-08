/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { SubscriptionList } from './subscrptionList';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';
import { SubscriptionState } from '../../../api/models/azureSubscription';

import { render } from '@testing-library/react';
describe('SubscriptionList', () => {
    it('matches snapshot when there are no list items', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), formState: 'idle'}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<SubscriptionList renderHubList={jest.fn()}/>);
        expect(container).toBeDefined();
    });

    it('matches snapshot when there are list items', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), subscriptions: [{
            displayName: 'test',
            id: 'id',
            tenantId: 'id',
            state: SubscriptionState.Disabled,
            subscriptionId: 'id'
        }]}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<SubscriptionList renderHubList={jest.fn()}/>);
        expect(container).toBeDefined();
    });
});
