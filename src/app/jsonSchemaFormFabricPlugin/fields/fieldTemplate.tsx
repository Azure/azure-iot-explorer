/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DirectionalHint, IconButton, Label, TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';
import { FieldTemplateProps } from 'react-jsonschema-form';
import { INFO } from '../../constants/iconNames';
import '../css/_fieldTemplate.scss';

// tslint:disable-next-line:cyclomatic-complexity
export const FieldTemplate = (props: FieldTemplateProps) => {
    const {
        id,
        classNames,
        errors,
        label,
        children,
        description,
        required,
        displayLabel
    } = props;

    return (
        <div className={classNames}>
            <div className="fieldTemplate">
                {displayLabel && label && <Label required={required} className="control-label" htmlFor={id}>
                    {label}
                </Label>}
                {displayLabel && description && description.props.description && (
                    <TooltipHost
                        content={description.props.description}
                        id={description.props.description}
                        calloutProps={{ gapSpace: 0 }}
                        directionalHint={DirectionalHint.rightCenter}
                    >
                        <IconButton
                            iconProps={{ iconName: INFO }}
                        />
                    </TooltipHost>
                    )}
            </div>
            <div className="fieldChildren">
                {children}
            </div>
            <div className="errors">
                {errors}
            </div>
        </div>
    );
};
