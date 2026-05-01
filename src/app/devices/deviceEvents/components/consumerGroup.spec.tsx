/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Input } from '@fluentui/react-components';
import { ConsumerGroup } from './consumerGroup';

describe('ConsumerGroup', () => {
    it('matches snapshot', () => {
        expect(shallow(<ConsumerGroup monitoringData={true} consumerGroup={'$Default'} setConsumerGroup={jest.fn()}/>)).toMatchSnapshot();
    });

    it('changes state accordingly when consumer group value is changed', () => {
        const setConsumerGroup = jest.fn();
        const wrapper = mount(<ConsumerGroup monitoringData={false} consumerGroup={''} setConsumerGroup={setConsumerGroup}/>);
        const input = wrapper.find(Input).first();
        act(() => input.props().onChange?.({} as any, { value: 'testGroup' }));
        expect(setConsumerGroup).toBeCalledWith('testGroup');
    });
});