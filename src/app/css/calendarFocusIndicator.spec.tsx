/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render } from '@testing-library/react';
import { Calendar } from '@fluentui/react-calendar-compat';

// _index.scss raises the focus indicator contrast of the compat Calendar used by the
// DatePicker (MAS 1.4.11). Those rules are keyed off Fluent's stable class names, so
// guard against a Fluent upgrade renaming them and silently dropping the indicator.
const SELECTED_BY_STYLESHEET = [
    'fui-Calendar',
    'fui-CalendarDay__headerIconButton',
    'fui-CalendarDay__monthAndYear',
    'fui-CalendarPicker__navigationButton',
    'fui-CalendarPicker__currentItemButton',
    'fui-CalendarPicker__itemButton',
    'fui-Calendar__goTodayButton'
];

describe('calendar focus indicator styling', () => {
    it('renders the class names the focus indicator styles target', () => {
        const { container } = render(
            <Calendar
                value={new Date(2026, 5, 15)}
                showGoToToday={true}
                isMonthPickerVisible={true}
                onSelectDate={jest.fn()}
            />
        );

        SELECTED_BY_STYLESHEET.forEach(className => {
            expect(container.getElementsByClassName(className).length).toBeGreaterThan(0);
        });
    });
});
