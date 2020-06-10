/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { DeviceQueryClause } from './deviceQueryClause';
import { ParameterType, OperationType } from '../../../api/models/deviceQuery';

describe('DeviceQueryClause', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(
            <DeviceQueryClause
                operation={OperationType.equals}
                parameterType={ParameterType.status}
                value="enabled"
                index={0}
                removeClause={jest.fn()}
                setClause={jest.fn()}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot without operation', () => {
        const wrapper = shallow(
            <DeviceQueryClause
                parameterType={ParameterType.edge}
                value="true"
                index={0}
                removeClause={jest.fn()}
                setClause={jest.fn()}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('calls removeClause', () => {
        const removeClause = jest.fn();
        const wrapper = shallow(
            <DeviceQueryClause
                parameterType={ParameterType.edge}
                value="enabled"
                index={0}
                removeClause={removeClause}
                setClause={jest.fn()}
            />
        );
        const removeButton = wrapper.find(IconButton);
        removeButton.simulate('click');
        expect(removeClause).toBeCalled();
    });
});
