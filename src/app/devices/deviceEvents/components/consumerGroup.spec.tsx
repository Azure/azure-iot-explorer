/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { TextField } from '@fluentui/react';
import { ConsumerGroup } from './consumerGroup';

describe('ConsumerGroup', () => {
    it('matches snapshot', () => {
        expect(shallow(<ConsumerGroup monitoringData={true} consumerGroup={'$Default'} setConsumerGroup={jest.fn()}/>)).toMatchSnapshot();
    });

    it('changes state accordingly when consumer group value is changed', () => {
        const setConsumerGroup = jest.fn();
        const wrapper = mount(<ConsumerGroup monitoringData={false} consumerGroup={''} setConsumerGroup={setConsumerGroup}/>);
        const textField = wrapper.find(TextField).first();
        act(() => textField.props().onChange?.(undefined as any, 'testGroup'));
        expect(setConsumerGroup).toBeCalledWith('testGroup');
    });
});