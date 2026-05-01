import * as React from 'react';
import { AzureActiveDirectoryStateContextProvider } from './azureActiveDirectoryStateProvider';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';

import { render } from '@testing-library/react';
describe('AzureActiveDirectoryStateContextProvider', ()=> {
    jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([getInitialAzureActiveDirectoryState(), jest.fn()]);

    it('matches snapshot', () => {
        const component = <AzureActiveDirectoryStateContextProvider>
            <span>test</span>
        </AzureActiveDirectoryStateContextProvider>;
        expect(render(component)).toBeDefined();
    });
});
