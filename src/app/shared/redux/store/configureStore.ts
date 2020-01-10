/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { fromJS } from 'immutable';
import reducer from '../reducer';
import rootSaga from '../../../devices/saga';
import { StateInterface } from '../state';
import { appConfig } from './../../../../appConfig/appConfig';

export default () => {
    const middlewares = [];

    const stateTransformer = (state: StateInterface) => {
        const s = fromJS(state);
        return s.toJS();
    };

    if (appConfig.developmentMode) {
        const logger = createLogger({stateTransformer});
        middlewares.push(logger);
    }

    const sagaMiddleware = createSagaMiddleware();
    middlewares.push(sagaMiddleware);

    // tslint:disable-next-line:no-any
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        reducer,
        composeEnhancers(applyMiddleware(...middlewares)),
    );
    // some system (not project) configurations fail to realize that this is valid without an any
    // tslint:disable-next-line:no-any
    sagaMiddleware.run(rootSaga as any);

    return store;
};
