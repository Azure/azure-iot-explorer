/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { LocalizationContextProvider } from '../contexts/localizationContext';

export const testWithLocalizationContext = (Target: JSX.Element, enzymeWrapper: any = shallow) => { // tslint:disable-line:no-any
    const outerWrapper = shallow(Target);
    const Children = outerWrapper.props().children;

    return enzymeWrapper(<Children t={jest.fn()}/>);
};

export const testWithLocalizationContextAndErrorBoundary = (Target: JSX.Element, enzymeWrapper: any = shallow) => { // tslint:disable-line:no-any
    const outerWrapper = shallow(Target);
    const Children = outerWrapper.props().children.props.children;

    return enzymeWrapper(<Children t={jest.fn()}/>);
};

export const testSnapshot = (Target: JSX.Element) => {
    const outerWrapper = shallow(Target);
    const Children = outerWrapper.props().children;
    expect(shallow(<Children t={jest.fn((value: string) => value)}/>)).toMatchSnapshot();
};

export const mountWithLocalization = (Target: JSX.Element, useMemoryRouter: boolean = false, routerInitialEntries = ['/']) => {
    const wrapper = (
        <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
            {Target}
        </LocalizationContextProvider>
    );
    if ( useMemoryRouter ) {
        return mount(
            <MemoryRouter initialEntries={routerInitialEntries} keyLength={0}>
                {wrapper}
            </MemoryRouter>
        );
    }

    return mount(wrapper);
};
