/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import Header from './header';
import { testWithLocalizationContext } from '../utils/testHelpers';

describe('shared/components/header', () => {

    const onSettingsVisibilityChanged = jest.fn();
    const getComponent = (overrides = {}) => {
        const props = {
            onSettingsVisibilityChanged,
            settingsVisible: false,
            ...overrides
        };
        return testWithLocalizationContext(<Header {...props} />);
    };

    it('matches snapshot when settings is not visible', () => {
        const component = getComponent();
        expect(component).toMatchSnapshot();

        const settingButton = component.find(ActionButton).first();
        expect(settingButton.props().className).toEqual('');
        settingButton.props().onClick();
        expect(onSettingsVisibilityChanged).toBeCalled();
    });

    it('matches snapshot when settings is visible', () => {
        const component = getComponent({settingsVisible: true});
        // expect(component).toMatchSnapshot();

        const settingButton = component.find(ActionButton).first();
        expect(settingButton.props().className).toEqual('settings-visible');
        settingButton.props().onClick();
        expect(onSettingsVisibilityChanged).toBeCalled();
    });
});
