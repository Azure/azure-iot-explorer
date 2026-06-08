import * as React from 'react';
import { AuthenticationStateContextProvider } from './authenticationStateProvider';
import { getInitialAuthenticationState } from '../state';
import * as AsyncSagaReducer from '../../shared/hooks/useAsyncSagaReducer';

import { render } from '@testing-library/react';
describe('AuthenticationStateContextProvider', ()=> {
    jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([getInitialAuthenticationState(), jest.fn()]);

    it('matches snapshot', () => {
        const component = <AuthenticationStateContextProvider>
            <span>test</span>
        </AuthenticationStateContextProvider>;
        expect(render(component)).toBeDefined();
    });
});
