/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ComboBox, DropdownMenuItemType } from 'office-ui-fabric-react';
import * as React from 'react';
import { WidgetProps } from 'react-jsonschema-form';

export interface Options {
    enumOptions: Array<{
        value: string;
        label: string;
        itemType?: DropdownMenuItemType;
    }>;
  }

// tslint:disable-next-line:no-any
const onChangePassthrough = (props: WidgetProps & { children?: React.ReactNode; }) => (event: any, value: any) => {
    props.onChange(value.key);
};

export const FabricSelect: React.StatelessComponent<WidgetProps> = props => {
    const options = props.options as Options;
    return (
        <ComboBox
            selectedKey={props.value}
            disabled={props.disabled}
            placeholder={props.placeholder}
            onChange={onChangePassthrough(props)}
            options={options.enumOptions.map(({ value, label, itemType }) => ({
                itemType,
                key: value,
                text: label,
            }))}
        />
    );
};
