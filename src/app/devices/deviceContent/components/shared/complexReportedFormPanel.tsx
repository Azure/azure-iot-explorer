/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import Form from 'react-jsonschema-form';
import { fabricWidgets, fabricFields } from '../../../../jsonSchemaFormFabricPlugin';
import { ObjectTemplate } from '../../../../jsonSchemaFormFabricPlugin/fields/objectTemplate';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { Exception } from '../../../../shared/utils/exceptions/exception';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { twinToFormDataConverter } from '../../../../shared/utils/twinAndJsonSchemaDataConverter';
import { CLOSE } from '../../../../constants/iconNames';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export interface ReportedFormDataProps {
    showPanel: boolean;
    formData: any; // tslint:disable-line:no-any
    schema: ParsedJsonSchema;
    modelDefinition: PropertyContent;
}

export interface ReportedFormActionProps {
    handleDismiss: () => void;
}

export interface ReportedFormState {
    formData: any; // tslint:disable-line:no-any
    parseMapTypeError?: Exception;
}

export default class ComplexReportedFormPanel extends React.Component<ReportedFormDataProps & ReportedFormActionProps, ReportedFormState> {
    constructor(props: ReportedFormDataProps & ReportedFormActionProps) {
        super(props);

        const { formData, schema } = this.props;
        const twinData = twinToFormDataConverter(formData, schema);
        this.state = {
            formData: twinData.formData,
            parseMapTypeError: twinData.error
        };
    }

    public render() {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <dialog open={this.props.showPanel} role="dialog">
                        <IconButton
                            className="close-dialog-icon"
                            iconProps={{ iconName: CLOSE }}
                            onClick={this.props.handleDismiss}
                        />
                        {this.createTitle(context)}
                        {this.createForm(context)}
                    </dialog>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly createTitle = (context: LocalizationContextInterface) => {
        const displayName = getLocalizedData(this.props.modelDefinition.displayName);
        return (
            <div className="panel-title">
                <h1>{context.t(ResourceKeys.deviceSettings.panel.title)}</h1>
                <Label>{this.props.modelDefinition.name} ({displayName ? displayName : '--'})</Label>
            </div>
        );
    }
    private readonly createForm = (context: LocalizationContextInterface) => {
        if (this.state.parseMapTypeError || !this.props.schema) { // Not able to parse interface definition, render raw json editor instead
            return this.createJsonEditor(context);
        }
        else {
            return (
                <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                    <Form
                        formData={this.state.formData}
                        liveValidate={true}
                        schema={this.props.schema as any} // tslint:disable-line: no-any
                        showErrorList={false}
                        uiSchema={{'ui:description': this.props.schema.description, 'ui:disabled': true}}
                        widgets={fabricWidgets}
                        {...fabricFields}
                        ObjectFieldTemplate={ObjectTemplate}
                    >
                        <br/>
                    </Form>
                </ErrorBoundary>
            );
        }
    }

    private readonly createJsonEditor = (context: LocalizationContextInterface) => {
        return (
            <form>
                <Label>{context.t(ResourceKeys.deviceProperties.editor.label, {schema: this.getSettingSchema()})}</Label>
                <div className="monaco-editor">
                    <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                        <Editor
                            language="json"
                            options={{
                                automaticLayout: true,
                                readOnly: true
                            }}
                            height="70vh"
                            value={JSON.stringify(this.state.formData, null, '\t')}
                        />
                    </React.Suspense>
                </div>
            </form>
        );
    }

    private readonly getSettingSchema = () => {
        const { modelDefinition } = this.props;
        return typeof modelDefinition.schema === 'string' ?
            modelDefinition.schema :
            modelDefinition.schema['@type'];
    }
}
