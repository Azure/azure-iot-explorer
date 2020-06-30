import { useCallback } from 'react';

export const sagaReducerLogger = <S, A>(reducer: React.Reducer<S, A>, stateName: string) => useCallback((state, action) => {
    const next = reducer(state, action);
    // tslint:disable
    console.log(`%cPrevious ${stateName}:`, 'color: #9E9E9E; font-weight: 700;', state.toJS());
    console.log('%cAction:', 'color: #00A7F7; font-weight: 700;', action);
    console.log(`%cNext ${stateName}:`, 'color: #47B04B; font-weight: 700;', (next as any).toJS());
    // tslint:enable
    return next;
  },                                                                                                    [reducer]);
