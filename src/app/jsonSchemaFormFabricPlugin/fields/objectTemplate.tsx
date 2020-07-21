/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import '../css/_objectTemplate.scss';

export const ObjectTemplate = (props: ObjectFieldTemplateProps) => {
    return (
        <section key={props.title} className="objectField">
            <Label>{props.title}</Label>
            {props.properties.map((element, index) =>
                <div key={index} className="element">{element.content}</div>
            )}
        </section>
    );
};
