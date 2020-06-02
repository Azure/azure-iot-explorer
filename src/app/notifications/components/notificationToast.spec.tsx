/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { CloseButton } from './notificationToast';

describe('shared/components/CloseButton', () => {
    it('renders button properly', () => {
        const wrapper = mount(<CloseButton/>).find(CloseButton);
        const button = wrapper.find(IconButton).first();
        expect(button.props().label).toEqual('common.close');
    });
});
