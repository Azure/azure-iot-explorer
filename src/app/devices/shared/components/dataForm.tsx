/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, ActionButton } from 'office-ui-fabric-react/lib/components/Button';
import { Dialog } from 'office-ui-fabric-react/lib/components/Dialog';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import Form from 'react-jsonschema-form';
import { Validator } from 'jsonschema';
import { fabricWidgets, fabricFields } from '../../../jsonSchemaFormFabricPlugin';
import { ObjectTemplate } from '../../../jsonSchemaFormFabricPlugin/fields/objectTemplate';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { SUBMIT, CODE } from '../../../constants/iconNames';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { dataToTwinConverter, twinToFormDataConverter } from '../../../shared/utils/twinAndJsonSchemaDataConverter';
import { ErrorBoundary } from './errorBoundary';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { JSONEditor } from '../../../shared/components/jsonEditor';
import { DtdlSchemaComplexType, getSchemaValidationErrors } from '../../../shared/utils/jsonSchemaAdaptor';
import '../../../css/_dataForm.scss';

export interface DataFormDataProps {
    formData: any;  // tslint:disable-line:no-any
    settingSchema: ParsedJsonSchema;
    buttonText: string;
    schema: string; // the schema as defined in model definition
}

export interface DataFormActionProps {
    handleSave: (twin: any) => () => void; // tslint:disable-line:no-any
    craftPayload?: (payload: object) => object;
}

export const DataForm: React.FC<DataFormDataProps & DataFormActionProps> = (props: DataFormDataProps & DataFormActionProps) => {
    const { t } = useTranslation();

    const { settingSchema, schema, buttonText, handleSave, craftPayload } = props;
    const twinData = twinToFormDataConverter(props.formData, settingSchema);
    const originalFormData = twinData.formData;
    const [ formData, setFormData ] = React.useState(originalFormData);
    const [ jsonEditorData, setJsonEditorData ] = React.useState(JSON.stringify(originalFormData || (schema === DtdlSchemaComplexType.Array ? [{}] : {}), null, '\t'));
    const [ showPayloadDialog, setShowPlayloadDialog ] = React.useState<boolean>(false);
    const parseMapTypeError = twinData.error;
    const [ payloadPreviewData, setPayloadPreviewData ] = React.useState(undefined);
    const [ isPayloadValid, setIsPayloadValid ] = React.useState<boolean>(true);

    const renderDialog = () => {
        return (
            <Dialog
                hidden={!showPayloadDialog}
                onDismiss={hidePayloadDialog}
                modalProps={{
                    className: 'delete-dialog',
                    isBlocking: false
                }}
            >
                { payloadPreviewData ?
                    <JSONEditor className="json-editor" content={JSON.stringify(payloadPreviewData, null, '\t')}/> :
                    <span>{t(ResourceKeys.deviceSettings.noPreviewContent)}</span>
                }
            </Dialog>
        );
    };

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
        if (parseMapTypeError || !settingSchema || (!settingSchema.type && !settingSchema.$ref)) { // Not able to parse interface definition, render raw json in editor instead
            return createJsonEditor();
        }
        else {
            return (
                <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                    <Form
                        className="value-section"
                        formData={stringifyNumberIfNecessary()}
                        liveValidate={false}
                        onChange={onChangeForm}
                        schema={settingSchema as any} // tslint:disable-line: no-any
                        showErrorList={false}
                        uiSchema={{'ui:description': settingSchema.description, 'ui:disabled': false}}
                        widgets={fabricWidgets}
                        {...fabricFields}
                        ObjectFieldTemplate={ObjectTemplate}
                    >
                        {renderMessageBodyWithValueValidation()}
                        {createActionButtons()}
                    </Form>
                </ErrorBoundary>
            );
        }
    };

    const createJsonEditor = () => {
        return (
            <form className="json-editor">
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.notifications.interfaceSchemaNotSupported, {
                        schema
                    })}
                >
                    {t(ResourceKeys.deviceContent.value)}
                </LabelWithTooltip>
                <JSONEditor className="json-editor" content={jsonEditorData} onChange={onChange}/>
                {createActionButtons()}
            </form>
        );
    };

    const onChange = (data: string) => {
        setIsPayloadValid(true);
        try {
            JSON.parse(data);
        }
        catch  {
            setIsPayloadValid(false);
        }
        setJsonEditorData(data);
    };

    const onChangeForm = (data: any) => { // tslint:disable-line: no-any
        setFormData(data.formData);
    };

    const generatePayload = () => {
        return (parseMapTypeError || !settingSchema || (!settingSchema.type && !settingSchema.$ref)) ?
            JSON.parse(jsonEditorData) :
            dataToTwinConverter(formData, settingSchema, originalFormData).twin;
    };

    const createPayloadPreview = () => {
        setPayloadPreviewData(craftPayload ? craftPayload(generatePayload()) : generatePayload());
        setShowPlayloadDialog(true);
    };

    const hidePayloadDialog = () => setShowPlayloadDialog(false);

    const stringifyNumberIfNecessary = () => {
        const value = formData;
        return typeof value === 'number' && value === 0 ? '0' : value; // javascript takes 0 as false, and json schema form would show it as undefined
    };

    const createActionButtons = () => {
        let payload;
        let buttonDisabled = false;

        try {
            payload = generatePayload();
        } catch (e) {
            payload = null;
            buttonDisabled = true;
        }

        return (
            <>
                <PrimaryButton
                    className="submit-button"
                    onClick={handleSave(payload)}
                    text={t(buttonText)}
                    iconProps={{ iconName: SUBMIT }}
                    disabled={buttonDisabled || !isPayloadValid}
                />
                <ActionButton
                    className="preview-payload-button"
                    onClick={createPayloadPreview}
                    text={t(ResourceKeys.deviceSettings.previewPayloadButtonText)}
                    iconProps={{ iconName: CODE }}
                    disabled={buttonDisabled || !isPayloadValid}
                />
            </>
        );
    };

    return (
        <>
            {createForm()}
            {renderDialog()}
        </>
    );
};

export const isValueDefined = (value: boolean | string | number | object) => {
    return value !== undefined || (typeof value === 'number' && value === 0) || typeof value === 'boolean';
};
