/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { CloseButton } from './notificationToast';
import { mountWithLocalization } from '../../shared/utils/testHelpers';

describe('shared/components/CloseButton', () => {
    it('renders button properly', () => {
        const wrapper = mountWithLocalization(<CloseButton/>).find(CloseButton);
        const button = wrapper.find(IconButton).first();
        expect(button.props().label).toEqual('common.close');
    });
});
