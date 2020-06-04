/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../../../app/shared/redux/store/configureStore';

export const mountWithStoreAndRouter = (Target: JSX.Element, connectToStore: boolean = false, useMemoryRouter: boolean = false, routerInitialEntries = ['/']) => {
    let wrapper = Target;

    if (connectToStore) {
        wrapper = (
            <Provider store={configureStore()}>
                {wrapper}
            </Provider>
        );
    }

    if (useMemoryRouter ) {
        wrapper = (
            <MemoryRouter initialEntries={routerInitialEntries} keyLength={0}>
                {wrapper}
            </MemoryRouter>
        );
    }

    return mount(wrapper);
};
