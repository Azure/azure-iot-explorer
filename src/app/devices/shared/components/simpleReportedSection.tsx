/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Validator, ValidationError } from 'jsonschema';
import { Label } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { isValueDefined } from './dataForm';
import { ResourceKeys } from '../../../../localization/resourceKeys';

// tslint:disable-next-line: cyclomatic-complexity
export const RenderSimplyTypeValue = (twin: any, schema: ParsedJsonSchema, displayValue: any, desired: boolean=false) => { // tslint:disable-line:no-any
    const validator = new Validator();
    const result = validator.validate(twin, schema);
    const getDisplayValue = () => {
        if (typeof(twin) === 'object') {
            const twinCopy = {
                'Ack code': twin.ac,
                'Ack description': twin.ad,
                'Ack version': twin.av,
                'value': twin.value
            };
            delete twinCopy.value;
            const twinObj = JSON.stringify(twinCopy, null, 2);
            return (
                <>
                    {twin.value}
                    <pre>{twinObj}</pre>
                </>
            );
        }
        return displayValue.toString();
    };

    return (
        <>
            {isValueDefined(twin) ?
                <Label>{getDisplayValue()}</Label> :
                <Label>--</Label>
            }
            {desired && !!result?.errors && renderSchemaErrors(result.errors)}
        </>
    );
};

const renderSchemaErrors = (errors: ValidationError[]) => {
    const { t } = useTranslation();
    const errorLabel = t(ResourceKeys.deviceSettings.columns.error);
    if (!errors || errors.length === 0) {
        return  null;
    }

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
