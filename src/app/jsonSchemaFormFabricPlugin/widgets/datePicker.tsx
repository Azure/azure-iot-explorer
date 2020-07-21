/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DatePicker, IDatePickerProps } from 'office-ui-fabric-react/lib/components/DatePicker';
import * as React from 'react';
import { WidgetProps } from 'react-jsonschema-form';
import { parseISO, toDate, format } from 'date-fns';

const onChangePassthrough = (props: WidgetProps) => (date: Date) => {
    props.onChange(
        format(date, 'yyyy-MM-dd')
    );
};

export const FabricDatePicker = (props: WidgetProps & { options: { fabricProps: IDatePickerProps } }) => {
    return (
        <DatePicker
            disabled={props.disabled}
            onSelectDate={onChangePassthrough(props)}
            value={toDate(parseISO(props.value))}
            placeholder={props.placeholder}
            {...props.options.fabricProps}
        />
    );
};
