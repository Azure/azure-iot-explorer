import * as React from 'react';
import { shallow } from 'enzyme';
import { AzureActiveDirectoryStateContextProvider } from './azureActiveDirectoryStateProvider';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';

describe('AzureActiveDirectoryStateContextProvider', ()=> {
    jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([getInitialAzureActiveDirectoryState(), jest.fn()]);

    it('matches snapshot', () => {
        const component = <AzureActiveDirectoryStateContextProvider>
            <span>test</span>
        </AzureActiveDirectoryStateContextProvider>;
        expect(shallow(component)).toMatchSnapshot();
    });
});
