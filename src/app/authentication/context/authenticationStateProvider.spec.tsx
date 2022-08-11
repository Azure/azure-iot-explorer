import * as React from 'react';
import { shallow } from 'enzyme';
import { AuthenticationStateContextProvider } from './authenticationStateProvider';
import { getInitialAuthenticationState } from '../state';
import * as AsyncSagaReducer from '../../shared/hooks/useAsyncSagaReducer';

describe('AuthenticationStateContextProvider', ()=> {
    jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([getInitialAuthenticationState(), jest.fn()]);

    it('matches snapshot', () => {
        const component = <AuthenticationStateContextProvider>
            <span>test</span>
        </AuthenticationStateContextProvider>;
        expect(shallow(component)).toMatchSnapshot();
    });
});
