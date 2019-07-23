/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';
import { IconButton, TooltipHost, DirectionalHint, Label } from 'office-ui-fabric-react';
import { INFO } from '../../constants/iconNames';
import '../css/_objectTemplate.scss';

export const ObjectTemplate = (props: ObjectFieldTemplateProps) => {
    return (
        <section key={props.title} className="objectField">
            {props.description && (
                <TooltipHost
                    content={props.description}
                    id={props.description}
                    calloutProps={{ gapSpace: 0 }}
                    directionalHint={DirectionalHint.rightCenter}
                >
                    <IconButton
                        iconProps={{ iconName: INFO }}
                        ariaLabel={props.description}
                    />
                </TooltipHost>
            )}
            {props.properties.map((element, index) =>
                <div key={index} className="element">{element.content}</div>
            )}
        </section>
    );
};
