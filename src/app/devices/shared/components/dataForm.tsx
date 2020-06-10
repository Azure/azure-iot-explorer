/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, ActionButton } from 'office-ui-fabric-react/lib/components/Button';
import { Dialog, DialogFooter } from 'office-ui-fabric-react/lib/components/Dialog';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/components/Spinner';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import Form from 'react-jsonschema-form';
import { Validator } from 'jsonschema';
import { fabricWidgets, fabricFields } from '../../../jsonSchemaFormFabricPlugin';
import { ObjectTemplate } from '../../../jsonSchemaFormFabricPlugin/fields/objectTemplate';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { SUBMIT, CODE } from '../../../constants/iconNames';
import { Exception } from '../../../shared/utils/exceptions/exception';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { dataToTwinConverter, twinToFormDataConverter } from '../../../shared/utils/twinAndJsonSchemaDataConverter';
import { ErrorBoundary } from './errorBoundary';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { useThemeContext } from '../../../shared/contexts/themeContext';
import '../../../css/_dataForm.scss';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);
const payloadRef = React.createRef<any>(); // tslint:disable-line:no-any

export interface DataFormDataProps {
    formData: any;  // tslint:disable-line:no-any
    componentName: string;
    settingSchema: ParsedJsonSchema;
    buttonText: string;
    schema: string; // the schema as defined in model definition
}

export interface DataFormActionProps {
    handleSave: (twin: any) => () => void; // tslint:disable-line:no-any
    craftPayload?: (payload: object) => object;
}

export interface DataFormState {
    formData: any; // tslint:disable-line:no-any
    originalFormData: any; // tslint:disable-line:no-any
    stringifiedFormData: string;
    parseMapTypeError?: Exception;
    showPayloadDialog?: boolean;
    payloadPreviewData?: any; // tslint:disable-line: no-any
}
export const DataForm: React.FC<DataFormDataProps & DataFormActionProps> = (props: DataFormDataProps & DataFormActionProps) => {
    const { t } = useTranslation();
    const { monacoTheme } = useThemeContext();

    const { settingSchema, schema, buttonText, handleSave, craftPayload } = props;
    const twinData = twinToFormDataConverter(props.formData, settingSchema);
    const originalFormData = twinData.formData;
    const [ formData, setFormData ] = React.useState(originalFormData);
    const [ showPayloadDialog, setShowPlayloadDialog ] = React.useState<boolean>(false);
    const parseMapTypeError = twinData.error;
    const [ payloadPreviewData, setPayloadPreviewData ] = React.useState(undefined);
    const [ stringifiedFormData, setStringifiedFormData ] = React.useState(JSON.stringify(twinData.formData, null, '\t'));

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
                <div className="monaco-editor">
                    <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                        <Editor
                            language="json"
                            ref={payloadRef}
                            options={{
                                automaticLayout: true,
                                readOnly: true,
                            }}
                            height="275px"
                            value={JSON.stringify(payloadPreviewData, null, '\t')}
                            theme={monacoTheme}
                        />
                    </React.Suspense>
                </div>
                <DialogFooter>
                    <PrimaryButton
                        onClick={copyPayload}
                        text={t(ResourceKeys.common.maskedCopyableTextField.copy.label)}
                    />
                </DialogFooter>
            </Dialog>
        );
    };

    const renderMessageBodyWithValueValidation = () => {
        const validator = new Validator();
        const result = validator.validate(formData, settingSchema);

        return(
            <div className="column-value-text col-sm4">
                <Label aria-label={t(ResourceKeys.deviceEvents.columns.value)}>
                    {result && result.errors && result.errors.length !== 0 &&
                        <section className="value-validation-error" aria-label={t(ResourceKeys.deviceSettings.columns.error)}>
                            <span>{t(ResourceKeys.deviceSettings.columns.error)}</span>
                            <ul>
                                {result.errors.map((element, index) =>
                                    <li key={index}>{element.message}</li>
                                )}
                            </ul>
                        </section>
                    }
                </Label>
            </div>
        );
    };

    const createForm = () => {
        if (parseMapTypeError || !settingSchema) { // Not able to parse interface definition, render raw json in editor instead
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
                <div className="monaco-editor">
                    <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                        <Editor
                            language="json"
                            options={{
                                automaticLayout: true,
                                readOnly: false
                            }}
                            height="30vh"
                            value={stringifiedFormData}
                            onChange={onChangeEditor}
                            theme={monacoTheme}
                        />
                    </React.Suspense>
                </div>
                {createActionButtons()}
            </form>
        );
    };

    const onChangeForm = (data: any) => { // tslint:disable-line: no-any
        setFormData(data.formData);
    };

    const onChangeEditor = (data: string) => {
        setStringifiedFormData(data);
    };

    const generatePayload = () => {
        return (parseMapTypeError || !settingSchema) ?
            stringifiedFormData && JSON.parse(stringifiedFormData) :
            dataToTwinConverter(formData, settingSchema, originalFormData).twin;
    };

    const createPayloadPreview = () => {
        setPayloadPreviewData(craftPayload ? craftPayload(generatePayload()) : generatePayload());
        setShowPlayloadDialog(true);
    };

    const hidePayloadDialog = () => setShowPlayloadDialog(false);

    const copyPayload = () => {
        const editor = payloadRef.current.editor;
        editor.setSelection(editor.getVisibleRanges()[0]);
        editor.focus();
        document.execCommand('copy');
    };

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
                    disabled={buttonDisabled}
                />
                <ActionButton
                    className="preview-payload-button"
                    onClick={createPayloadPreview}
                    text={t(ResourceKeys.deviceSettings.previewPayloadButtonText)}
                    iconProps={{ iconName: CODE }}
                    disabled={buttonDisabled}
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
