const useReducerSpy = jest.fn();
jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useReducer: (...args: any[]) => {
      useReducerSpy(...args);
      return actual.useReducer(...args);
    },
  };
});

import * as React from 'react';
import 'jest';
import { render, screen } from '@testing-library/react';
import { useAsyncSagaReducer } from './useAsyncSagaReducer';

describe('useAsyncSagaReducer', () => {
  type StateInterface = {foo: string};
  type Action<T> = { type: string, payload?: T };

  it('initializes reducer with initial state and returns current state', () => {
    const initialState: StateInterface = { foo: 'baz' };
    const fooReducer = jest.fn((state: StateInterface, action: Action<string>) => state);

    function* fooSaga() {
        yield true;
    }

    const TestReactComponent = () => {
      const [state, ] = useAsyncSagaReducer<StateInterface, Action<string>>(fooReducer, fooSaga, initialState);
      return (<p className="current-state">{state.foo}</p>);
    };

    render(<TestReactComponent />);

    expect(useReducerSpy).toHaveBeenCalledWith(fooReducer, initialState);
    expect(screen.getByText('baz')).toBeDefined();
  });
});
