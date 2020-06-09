/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { utc } from 'moment';
import { DatePicker, IDatePickerProps } from 'office-ui-fabric-react/lib/components/DatePicker';
import * as React from 'react';
import { WidgetProps } from 'react-jsonschema-form';

const onChangePassthrough = (props: WidgetProps) => (date: Date) => {
    props.onChange(
        utc(date).format('YYYY-MM-DD')
    );
};

export const FabricDatePicker = (props: WidgetProps & { options: { fabricProps: IDatePickerProps } }) => {
    return (
        <DatePicker
            disabled={props.disabled}
            onSelectDate={onChangePassthrough(props)}
            value={utc(props.value).toDate()}
            placeholder={props.placeholder}
            {...props.options.fabricProps}
        />
    );
};
