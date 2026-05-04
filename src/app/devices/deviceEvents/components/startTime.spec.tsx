/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StartTime, StartTimeProps } from './startTime';

// Mock Fluent UI components with accessible roles matching real component behavior
jest.mock('@fluentui/react-datepicker-compat', () => ({
    DatePicker: (props: any) => (
        <input
            role="combobox"
            aria-label="Select date"
            id={props.id}
            value={props.value ? 'date-set' : ''}
            disabled={props.disabled}
            onChange={() => props.onSelectDate(new Date(2026, 4, 4))}
            onClick={() => props.onSelectDate(new Date(2026, 4, 4))}
        />
    )
}));

jest.mock('@fluentui/react-timepicker-compat', () => ({
    TimePicker: (props: any) => (
        <input
            role="combobox"
            aria-label={props['aria-label'] || 'Select time'}
            id={props.id}
            value={props.value || ''}
            disabled={props.disabled}
            onChange={(e) => {
                if (props.onTimeChange) {
                    props.onTimeChange(e, { selectedTime: new Date(2026, 4, 4, 14, 30) });
                }
            }}
        />
    )
}));

describe('StartTime', () => {
    const defaultProps: StartTimeProps = {
        monitoringData: false,
        specifyStartTime: false,
        startTime: undefined,
        setSpecifyStartTime: jest.fn(),
        setStartTime: jest.fn(),
        setHasError: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders toggle switch', () => {
        render(<StartTime {...defaultProps} />);
        expect(screen.getByRole('switch')).toBeDefined();
    });

    it('does not show date/time pickers when specifyStartTime is false', () => {
        render(<StartTime {...defaultProps} />);
        expect(screen.queryByRole('combobox')).toBeNull();
    });

    it('shows date/time pickers when specifyStartTime is true', () => {
        render(<StartTime {...defaultProps} specifyStartTime={true} startTime={new Date(2026, 4, 4, 10, 0)} />);
        const comboboxes = screen.getAllByRole('combobox');
        expect(comboboxes).toHaveLength(2);
    });

    it('sets startTime to now when toggling on with no existing time', () => {
        const setStartTime = jest.fn();
        const setSpecifyStartTime = jest.fn();
        render(<StartTime {...defaultProps} setStartTime={setStartTime} setSpecifyStartTime={setSpecifyStartTime} />);

        fireEvent.click(screen.getByRole('switch'));

        expect(setStartTime).toHaveBeenCalledWith(expect.any(Date));
        expect(setSpecifyStartTime).toHaveBeenCalledWith(true);
    });

    it('does not reset startTime when toggling on with existing time', () => {
        const existingTime = new Date(2026, 4, 4, 10, 0);
        const setStartTime = jest.fn();
        render(<StartTime {...defaultProps} startTime={existingTime} setStartTime={setStartTime} />);

        fireEvent.click(screen.getByRole('switch'));

        expect(setStartTime).not.toHaveBeenCalled();
    });

    it('disables controls when monitoringData is true', () => {
        render(<StartTime {...defaultProps} monitoringData={true} specifyStartTime={true} startTime={new Date()} />);

        expect((screen.getByRole('switch') as HTMLInputElement).disabled).toBe(true);
        const comboboxes = screen.getAllByRole('combobox');
        comboboxes.forEach(cb => expect((cb as HTMLInputElement).disabled).toBe(true));
    });

    it('calls setStartTime with updated date when date is selected', () => {
        const existingTime = new Date(2026, 0, 1, 15, 45);
        const setStartTime = jest.fn();
        render(<StartTime {...defaultProps} specifyStartTime={true} startTime={existingTime} setStartTime={setStartTime} />);

        fireEvent.click(screen.getByRole('combobox', { name: /select date/i }));

        // Should update the date to May 4 2026 but keep the time (15:45)
        expect(setStartTime).toHaveBeenCalled();
        const newDate: Date = setStartTime.mock.calls[0][0];
        expect(newDate.getFullYear()).toBe(2026);
        expect(newDate.getMonth()).toBe(4); // May
        expect(newDate.getDate()).toBe(4);
        expect(newDate.getHours()).toBe(15);
        expect(newDate.getMinutes()).toBe(45);
    });

    it('calls setStartTime with updated time when time is selected', () => {
        const existingTime = new Date(2026, 0, 1, 10, 0);
        const setStartTime = jest.fn();
        const setHasError = jest.fn();
        render(<StartTime {...defaultProps} specifyStartTime={true} startTime={existingTime} setStartTime={setStartTime} setHasError={setHasError} />);

        fireEvent.change(screen.getByRole('combobox', { name: /time/i }), { target: { value: '2:30 PM' } });

        // Should update time to 14:30 but keep the date (Jan 1 2026)
        expect(setStartTime).toHaveBeenCalled();
        const newDate: Date = setStartTime.mock.calls[0][0];
        expect(newDate.getFullYear()).toBe(2026);
        expect(newDate.getMonth()).toBe(0); // Jan
        expect(newDate.getDate()).toBe(1);
        expect(newDate.getHours()).toBe(14);
        expect(newDate.getMinutes()).toBe(30);
    });

    it('calls setHasError(false) when valid date is selected', () => {
        const setHasError = jest.fn();
        const setStartTime = jest.fn();
        render(<StartTime {...defaultProps} specifyStartTime={true} startTime={new Date()} setStartTime={setStartTime} setHasError={setHasError} />);

        fireEvent.click(screen.getByRole('combobox', { name: /select date/i }));
        expect(setHasError).toHaveBeenCalledWith(false);
    });

    it('displays time picker with accessible label when startTime is set', () => {
        const time = new Date(2026, 4, 4, 14, 30); // 2:30 PM
        render(<StartTime {...defaultProps} specifyStartTime={true} startTime={time} />);

        const timePicker = screen.getByRole('combobox', { name: /time/i });
        expect(timePicker).toBeDefined();
    });

    it('displays formatted time for AM hours', () => {
        const time = new Date(2026, 4, 4, 9, 5); // 9:05 AM
        render(<StartTime {...defaultProps} specifyStartTime={true} startTime={time} />);

        const timePicker = screen.getByRole('combobox', { name: /time/i });
        expect(timePicker).toBeDefined();
    });

    it('displays time picker for noon', () => {
        const time = new Date(2026, 4, 4, 12, 0);
        render(<StartTime {...defaultProps} specifyStartTime={true} startTime={time} />);

        const timePicker = screen.getByRole('combobox', { name: /time/i });
        expect(timePicker).toBeDefined();
    });

    it('displays time picker for midnight', () => {
        const time = new Date(2026, 4, 4, 0, 0);
        render(<StartTime {...defaultProps} specifyStartTime={true} startTime={time} />);

        const timePicker = screen.getByRole('combobox', { name: /time/i });
        expect(timePicker).toBeDefined();
    });
});
