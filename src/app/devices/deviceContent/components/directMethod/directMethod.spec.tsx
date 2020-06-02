/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DirectMethod, DirectMethodProps } from './directMethod';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: '?deviceId=test' })
}));

describe('directMethod', () => {
    const mockInvokeMethodClick = jest.fn();
    const directMethodProps: DirectMethodProps = {
        onInvokeMethodClick: mockInvokeMethodClick
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...directMethodProps,
            ...overrides
        };

        return <DirectMethod {...props} />;
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });
});
