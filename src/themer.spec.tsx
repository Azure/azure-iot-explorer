/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import Themer from './themer';
import { THEME_SELECTION, HIGH_CONTRAST } from './app/constants/browserStorage';

describe('themer', () => {
    it('matches snapshot', () => {
        localStorage.removeItem(THEME_SELECTION);
        localStorage.removeItem(HIGH_CONTRAST);
        const component = (
            <Themer />
        );
        expect(mount(component)).toMatchSnapshot();
    });
    it('matches snapshot with high contrast', () => {
        localStorage.removeItem(THEME_SELECTION);
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const component = (
            <Themer />
        );
        expect(mount(component)).toMatchSnapshot();
    });

    it('matches snapshot with theme set to dark', () => {
        localStorage.setItem(THEME_SELECTION, 'dark');
        localStorage.removeItem(HIGH_CONTRAST);
        const component = (
            <Themer />
        );
        expect(mount(component)).toMatchSnapshot();
    });

    it('matches snapshot with theme set to light', () => {
        localStorage.setItem(THEME_SELECTION, 'light');
        localStorage.removeItem(HIGH_CONTRAST);
        const component = (
            <Themer />
        );
        expect(mount(component)).toMatchSnapshot();
    });

    it('matches snapshot with theme set to highContrastBlack without high contrast', () => {
        localStorage.setItem(THEME_SELECTION, 'highContrastBlack');
        localStorage.removeItem(HIGH_CONTRAST);
        const component = (
            <Themer />
        );
        expect(mount(component)).toMatchSnapshot();
    });

    it('matches snapshot with theme set to highContrastWhite without high contrast', () => {
        localStorage.setItem(THEME_SELECTION, 'highContrastWhite');
        localStorage.removeItem(HIGH_CONTRAST);
        const component = (
            <Themer />
        );
        expect(mount(component)).toMatchSnapshot();
    });

    it('matches snapshot with theme set to dark and high contrast', () => {
        localStorage.setItem(THEME_SELECTION, 'dark');
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const component = (
            <Themer />
        );
        expect(mount(component)).toMatchSnapshot();
    });

    it('matches snapshot with theme set to light and high contrast', () => {
        localStorage.setItem(THEME_SELECTION, 'light');
        localStorage.setItem(HIGH_CONTRAST, 'true');
        const component = (
            <Themer />
        );
        expect(mount(component)).toMatchSnapshot();
    });
});
