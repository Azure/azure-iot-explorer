/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ITextFieldProps, TextField } from 'office-ui-fabric-react/lib/components/TextField';
import { Widget } from 'react-jsonschema-form';

// tslint:disable-next-line:no-any
const onChangePassthrough = (props: ITextFieldProps) => (event: any, value: any) => {
    props.onChange(value);
};

const FabricTextHighOrder = (highOrderProps?: ITextFieldProps) => (props: ITextFieldProps) => {
    return (
        <TextField
            value={props.value}
            disabled={props.disabled}
            onChange={onChangePassthrough(props)}
            {...highOrderProps}
        />
    );
};

export const FabricText: Widget = FabricTextHighOrder();
export const FabricTextArea: Widget = FabricTextHighOrder({ multiline: true });
