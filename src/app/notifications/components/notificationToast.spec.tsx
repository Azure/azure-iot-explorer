/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import { Button } from '@fluentui/react-components';
import { CloseButton } from './notificationToast';

describe('shared/components/CloseButton', () => {
    it('renders button properly', () => {
        const wrapper = mount(<CloseButton/>).find(CloseButton);
        const button = wrapper.find(Button).first();
        expect(button.props()['aria-label']).toEqual('common.close');
    });
});
