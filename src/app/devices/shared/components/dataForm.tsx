/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, Label } from '@fluentui/react';
import { Form as MaterialForm } from '@rjsf/material-ui';
import { Form as FluentForm } from '@rjsf/fluent-ui';
import validator from '@rjsf/validator-ajv8';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { SUBMIT } from '../../../constants/iconNames';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { ErrorBoundary } from './errorBoundary';
import { getSchemaValidationErrors } from '../../../shared/utils/jsonSchemaAdaptor';
import '../../../css/_dataForm.scss';

export interface DataFormDataProps {
    formData: any;  // tslint:disable-line:no-any
    settingSchema: ParsedJsonSchema;
    buttonText: string;
    schema: string; // the schema as defined in model definition
}

export interface DataFormActionProps {
    handleSave: (twin: any) => () => void; // tslint:disable-line:no-any
}

export const DataForm: React.FC<DataFormDataProps & DataFormActionProps> = (props: DataFormDataProps & DataFormActionProps) => {
    const { t } = useTranslation();
    const { settingSchema, buttonText, handleSave } = props;
    const [ formData, setFormData ] = React.useState(props.formData);

    const renderMessageBodyWithValueValidation = () => {
        const errors = getSchemaValidationErrors(formData, settingSchema);
        return(
            <div className="column-value-text col-sm4">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.value)}>
                    {errors.length !== 0 &&
                        <section className="value-validation-error" aria-label={t(ResourceKeys.deviceSettings.columns.error)}>
                            <span>{t(ResourceKeys.deviceSettings.columns.error)}</span>
                            <ul>
                                {errors.map((error, index) => <li key={index}>{error.message}</li>)}
                            </ul>
                        </section>
                    }
                </Label>
            </div>
        );
    };

    const createForm = () => {
        let uiSchema: any = {'ui:description': settingSchema?.description, 'ui:disabled': false}; // tslint:disable-line: no-any
        if (settingSchema?.type === 'boolean') {
            uiSchema = {
                ...uiSchema,
                'ui:widget': 'radio'
            };
        }

        let form: JSX.Element;
        if (containsMapsInSchema(settingSchema)) { // FluentForm does not support map (additionalProperties yet)
            form = (
                <MaterialForm
                    className="value-section"
                    formData={formData}
                    liveValidate={false}
                    onChange={onChangeForm}
                    schema={settingSchema as any} // tslint:disable-line: no-any
                    showErrorList={false}
                    uiSchema={uiSchema}
                    validator={validator}
                >
                    {renderMessageBodyWithValueValidation()}
                    {createActionButtons()}
                </MaterialForm>
            );
        }
        else {
            form = (
                <FluentForm
                    className="value-section"
                    formData={formData}
                    liveValidate={false}
                    onChange={onChangeForm}
                    schema={settingSchema as any} // tslint:disable-line: no-any
                    showErrorList={false}
                    uiSchema={uiSchema}
                    validator={validator}
                >
                    {renderMessageBodyWithValueValidation()}
                    {createActionButtons()}
                </FluentForm>
            );
        }

        return (
            <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                {form}
            </ErrorBoundary>
        );
    };

    const onChangeForm = (data: any) => { // tslint:disable-line: no-any
        if (settingSchema.type === 'boolean') {
            setFormData(data.formData === '0' ? true : false);
        }
        else {
            setFormData(data.formData);
        }
    };

    const createActionButtons = () => {
        let payload;
        let buttonDisabled = false;

        try {
            payload = formData;
        } catch (e) {
            payload = null;
            buttonDisabled = true;
        }

        return (
            <PrimaryButton
                className="submit-button"
                onClick={handleSave(payload)}
                text={t(buttonText)}
                iconProps={{ iconName: SUBMIT }}
                disabled={buttonDisabled}
            />
        );
    };

    return (
        <>
            {createForm()}
        </>
    );
};

export const isValueDefined = (value: boolean | string | number | object) => {
    return value !== undefined || (typeof value === 'number' && value === 0) || typeof value === 'boolean';
};

export const containsMapsInSchema = (settingSchema: ParsedJsonSchema): boolean => {
    const hasMatch = settingSchema && JSON.stringify(settingSchema).match(/additionalProperties/g);
    return hasMatch?.length > 0;
};
