/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Validator, ValidationError } from 'jsonschema';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';

export const RenderSimplyTypeValue = (twin: any, schema: ParsedJsonSchema, errorLabel: string) => { // tslint:disable-line:no-any
    const validator = new Validator();
    const result = validator.validate(twin, schema);
    return (
        <>
            <Label>{twin && twin.toString()}</Label>
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
