/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { WidgetProps } from 'react-jsonschema-form';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

// tslint:disable-next-line:no-any
const onChangePassthrough = (props: WidgetProps) => (event: any, value: any) => {
    props.onChange(!props.value);
};

export const FabricCheckbox = (props: WidgetProps & { label: string }) => (
    <div className="ms-font-m" style={{ display: 'flex' }}>
        <Checkbox
            checked={!!props.value}
            value={props.value}
            disabled={props.disabled}
            label={props.label}
            placeholder={props.placeholder}
            onChange={onChangePassthrough(props)}
        />
    </div>
);
