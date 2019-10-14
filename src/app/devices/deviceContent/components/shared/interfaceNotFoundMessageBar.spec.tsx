/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { MessageBarButton } from 'office-ui-fabric-react/lib/Button';
import InterfaceNotFoundMessageBox from './interfaceNotFoundMessageBar';
import { testSnapshot, mountWithLocalization } from '../../../../shared/utils/testHelpers';

describe('interfaceNotFoundMessageBar', () => {
    const settingsVisibleToggle = jest.fn();
    const getComponent = (overrides = {}) => {
        const props = {
            settingsVisibleToggle,
            ...overrides
        };

        return <InterfaceNotFoundMessageBox {...props} />;
    };

    it('matches snapshot with simple type', () => {
        testSnapshot(getComponent());
        const wrapper = mountWithLocalization(getComponent());
        const messageBarButton = wrapper.find(MessageBarButton);
        messageBarButton.props().onClick(null);
        expect(settingsVisibleToggle).toBeCalled();
    });
});
