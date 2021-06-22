/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { WidgetProps } from 'react-jsonschema-form';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';

// tslint:disable-next-line:no-any
const onChangePassthrough = (props: WidgetProps) => (event: any, value: any) => {
    props.onChange(value.key === 'true' ? true : false);
};

export const FabricCheckbox = (props: WidgetProps & { label: string }) => {
    const options: IChoiceGroupOption[] = [
        { key: 'true', text: 'true' },
        { key: 'false', text: 'false' }
      ];

    return(
        // don't check 'props.value' because boolean with value 'false' would be skipped ('null' would 'false' in checkbox control, so no exception without the check)
        <ChoiceGroup selectedKey={props.value.toString()} options={options} onChange={onChangePassthrough(props)} label={props.label} disabled={props.disabled}/>
    );
};
