import * as React from 'react';
import { runSaga, stdChannel, Saga } from 'redux-saga';

export const useAsyncSagaReducer = <S, A>(reducer: React.Reducer<S, A>, saga: Saga<never[]>, initialState?: S): [S, (action: A) => void]  => {
  const [state, reactDispatch] = React.useReducer<React.Reducer<S, A>>(reducer, initialState);
  const stateRef = React.useRef(state);
  React.useEffect(() => {
    stateRef.current = state;
  },              [state]);

  const sagaChannel = React.useMemo(() => {
    const channel = stdChannel();
    const dispatch = (action: A) => {
      reactDispatch(action);
      Promise.resolve().then(() => {
        channel.put(action);
      });
    };
    const getState = () => stateRef.current;

    return { channel, dispatch, getState };
  },                                []);

  React.useEffect(() => {
    const task = runSaga(sagaChannel, saga);

    return () => {
      task.cancel();
    };
  },              [sagaChannel]);

  return [state, sagaChannel.dispatch];
};
