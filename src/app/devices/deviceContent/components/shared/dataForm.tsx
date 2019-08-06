/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { PrimaryButton, Dialog, DialogFooter, DefaultButton } from 'office-ui-fabric-react';
import Form from 'react-jsonschema-form';
import Editor from 'react-monaco-editor';
import { fabricWidgets, fabricFields } from '../../../../jsonSchemaFormFabricPlugin';
import { ObjectTemplate } from '../../../../jsonSchemaFormFabricPlugin/fields/objectTemplate';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { SUBMIT, CODE } from '../../../../constants/iconNames';
import { Exception } from '../../../../shared/utils/exceptions/exception';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { dataToTwinConverter, twinToFormDataConverter } from '../../../../shared/utils/twinAndJsonSchemaDataConverter';
import ErrorBoundary from '../../../../devices/errorBoundary';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import '../../../../css/_dataForm.scss';

const payloadRef = React.createRef<Editor>();

export interface DataFormDataProps {
    formData: any;  // tslint:disable-line:no-any
    interfaceName: string;
    settingSchema: ParsedJsonSchema;
    buttonText: string;
    schema: string; // the schema as defined in model definition
}

export interface DataFormActionProps {
    handleSave: (twin: any) => () => void; // tslint:disable-line:no-any
    craftPayload: (payload: object) => object;
}

export interface DataFormState {
    formData: any; // tslint:disable-line:no-any
    originalFormData: any; // tslint:disable-line:no-any
    stringifiedFormData: string;
    parseMapTypeError?: Exception;
    showPayloadDialog?: boolean;
    payloadPreviewData?: any; // tslint:disable-line: no-any
}
export default class DataForm extends React.Component<DataFormDataProps & DataFormActionProps, DataFormState> {
    constructor(props: DataFormDataProps & DataFormActionProps) {
        super(props);

        const { formData, settingSchema } = this.props;
        const twinData = twinToFormDataConverter(formData, settingSchema);
        this.state = {
            formData: twinData.formData,
            originalFormData: twinData.formData,
            parseMapTypeError: twinData.error,
            stringifiedFormData: JSON.stringify(twinData.formData, null, '\t')
        };
    }

    public render() {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.createForm(context)}
                        {this.renderDialog(context)}
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly renderDialog = (context: LocalizationContextInterface) => {
        return (
            <Dialog
                hidden={!this.state.showPayloadDialog}
                onDismiss={this.hidePayloadDialog}
                modalProps={{
                    className: 'delete-dialog',
                    isBlocking: false,
                }}
            >
                <Editor
                    language="json"
                    ref={payloadRef}
                    options={{
                        automaticLayout: true,
                        readOnly: true,
                    }}
                    height="275px"
                    value={JSON.stringify(this.state.payloadPreviewData, null, '\t')}
                />
                <DialogFooter>
                    <PrimaryButton
                        onClick={this.copyPayload}
                        text={context.t(ResourceKeys.common.copyableMaskField.copy.label)}
                    />
                </DialogFooter>
            </Dialog>
        );
    }

    private readonly createForm = (context: LocalizationContextInterface) => {
        if (this.state.parseMapTypeError || !this.props.settingSchema) { // Not able to parse interface definition, render raw json in editor instead
            return this.createJsonEditor(context);
        }
        else {
            return (
                <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                    <Form
                        className="value-section"
                        formData={this.state.formData}
                        liveValidate={true}
                        onChange={this.onChangeForm}
                        schema={this.props.settingSchema as any} // tslint:disable-line: no-any
                        showErrorList={false}
                        uiSchema={{'ui:description': this.props.settingSchema.description, 'ui:disabled': false}}
                        widgets={fabricWidgets}
                        {...fabricFields}
                        ObjectFieldTemplate={ObjectTemplate}
                    >
                        {this.createActionButtons(context)}
                    </Form>
                </ErrorBoundary>
            );
        }
    }

    private readonly createJsonEditor = (context: LocalizationContextInterface) => {
        return (
            <form className="json-editor">
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.notifications.interfaceSchemaNotSupported, {
                        schema: this.props.schema
                    })}
                >
                    {context.t(ResourceKeys.deviceContent.value)}
                </LabelWithTooltip>
                <Editor
                    language="json"
                    options={{
                        automaticLayout: true,
                        readOnly: false
                    }}
                    height="30vh"
                    value={this.state.stringifiedFormData}
                    onChange={this.onChangeEditor}
                />
                {this.createActionButtons(context)}
            </form>
        );
    }

    private readonly onChangeForm = (data: any) => { // tslint:disable-line: no-any
        this.setState({formData: data.formData});
    }

    private readonly onChangeEditor = (data: string) => {
        this.setState({stringifiedFormData: data});
    }

    private readonly createPayloadPreview = () => {
        const payload = (this.state.parseMapTypeError || !this.props.settingSchema) ?
        this.state.stringifiedFormData && JSON.parse(this.state.stringifiedFormData) :
        dataToTwinConverter(this.state.formData, this.props.settingSchema, this.state.originalFormData).twin;
        this.setState({
            payloadPreviewData: this.props.craftPayload(payload || null),
            showPayloadDialog: true
        });
    }

    private readonly hidePayloadDialog = () => {
        this.setState({showPayloadDialog: false});
    }

    private readonly copyPayload = () => {
        const editor = payloadRef.current.editor;
        editor.setSelection(editor.getVisibleRanges()[0]);
        editor.focus();
        document.execCommand('copy');
    }

    private readonly createActionButtons = (context: LocalizationContextInterface) => {
        const payload = (this.state.parseMapTypeError || !this.props.settingSchema) ?
            this.state.stringifiedFormData && JSON.parse(this.state.stringifiedFormData) :
            dataToTwinConverter(this.state.formData, this.props.settingSchema, this.state.originalFormData).twin;
        return (
            <>
                <PrimaryButton
                    className="submit-button"
                    onClick={this.props.handleSave(payload)}
                    text={context.t(this.props.buttonText)}
                    iconProps={{ iconName: SUBMIT }}
                />
                <DefaultButton
                    className="preview-payload-button"
                    onClick={this.createPayloadPreview}
                    text={context.t(ResourceKeys.deviceSettings.previewPayloadButtonText)}
                    iconProps={{ iconName: CODE }}
                />
            </>
        );
    }
}
