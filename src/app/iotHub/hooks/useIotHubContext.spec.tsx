/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { mount } from 'enzyme';
import { useIotHubContext, IotHubContext } from './useIotHubContext';

const TestComponent: React.FC = () => {
    useIotHubContext();
    return <></>;
};

describe('useIotHubContext', () => {
    it('calls context with expected value', () => {
        const spy = jest.spyOn(React, 'useContext');

        mount(<TestComponent/>);
        expect(spy).toHaveBeenCalledWith(IotHubContext)
    });
});
