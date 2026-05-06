import * as React from 'react';
import { runSaga, stdChannel, Saga } from 'redux-saga';
import { useSagaReducerLogger } from './sagaReducerLogger';

export const useAsyncSagaReducer = <S, A>(reducer: React.Reducer<S, A>, saga: Saga, initialState?: S, stateName?: string): [S, (action: A) => void]  => {
  const loggedReducer = useSagaReducerLogger(reducer, stateName);
  const effectiveReducer = process.env.NODE_ENV === 'development' ? loggedReducer : reducer;
  const [state, reactDispatch] = React.useReducer(effectiveReducer, initialState as S);
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
  },              [sagaChannel]); // eslint-disable-line react-hooks/exhaustive-deps -- saga is stable (passed once)

  return [state, sagaChannel.dispatch];
};
