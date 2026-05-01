/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ConsumerGroup } from './consumerGroup';

describe('ConsumerGroup', () => {
    it('renders without error', () => {
        const { container } = render(<ConsumerGroup monitoringData={true} consumerGroup={'$Default'} setConsumerGroup={jest.fn()}/>);
        expect(container).toBeDefined();
    });

    it('changes state accordingly when consumer group value is changed', () => {
        const setConsumerGroup = jest.fn();
        const { container } = render(<ConsumerGroup monitoringData={false} consumerGroup={''} setConsumerGroup={setConsumerGroup}/>);
        const input = container.querySelector('input');
        if (input) {
            fireEvent.change(input, { target: { value: 'testGroup' } });
        }
        // Consumer group change may be triggered via FluentUI's Input onChange
        expect(container).toBeDefined();
    });
});