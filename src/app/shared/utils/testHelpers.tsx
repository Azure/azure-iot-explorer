/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';

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
