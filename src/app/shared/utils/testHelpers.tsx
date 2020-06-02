/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../../../app/shared/redux/store/configureStore';

export const testWithLocalizationContextAndErrorBoundary = (Target: JSX.Element, enzymeWrapper: any = shallow) => { // tslint:disable-line:no-any
    const outerWrapper = shallow(Target);
    const Children = outerWrapper.props().children.props.children;

    return enzymeWrapper(<Children t={jest.fn()}/>);
};

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
