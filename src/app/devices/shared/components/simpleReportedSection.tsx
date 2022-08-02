/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Validator, ValidationError } from 'jsonschema';
import { Label } from '@fluentui/react';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { isValueDefined } from './dataForm';

// tslint:disable-next-line: cyclomatic-complexity
export const RenderSimplyTypeValue = (twin: any, schema: ParsedJsonSchema, displayValue: any, errorLabel: string) => { // tslint:disable-line:no-any
    const validator = new Validator();
    const result = validator.validate(twin, schema);
    const getDisplayValue = () => {
        return typeof(twin) === 'object' ? JSON.stringify(twin) : displayValue.toString();
    };
    return (
        <>
            {isValueDefined(twin) ?
                <Label>{getDisplayValue()}</Label> :
                <Label>--</Label>
            }
            {result && result.errors && result.errors.length !== 0 && renderSchemaErrors(result.errors, errorLabel)}
        </>
    );
};

const renderSchemaErrors = (errors: ValidationError[], errorLabel: string) => {
    return (
        <section className="value-validation-error" aria-label={errorLabel}>
            <span>{errorLabel}</span>
            <ul>
            {errors.map((element, index) =>
                <li key={index}>{element.message}</li>
            )}
            </ul>
        </section>
    );
};
