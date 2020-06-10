/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/components/Spinner';
import Form from 'react-jsonschema-form';
import { fabricWidgets, fabricFields } from '../../../jsonSchemaFormFabricPlugin';
import { ObjectTemplate } from '../../../jsonSchemaFormFabricPlugin/fields/objectTemplate';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { Exception } from '../../../shared/utils/exceptions/exception';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { twinToFormDataConverter } from '../../../shared/utils/twinAndJsonSchemaDataConverter';
import { CLOSE } from '../../../constants/iconNames';
import { PropertyContent } from '../../../api/models/modelDefinition';
import { ErrorBoundary } from './errorBoundary';
import { getLocalizedData } from '../../../api/dataTransforms/modelDefinitionTransform';
import { useThemeContext } from '../../../shared/contexts/themeContext';

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

export const ComplexReportedFormPanel: React.FC<ReportedFormDataProps & ReportedFormActionProps> = (props: ReportedFormDataProps & ReportedFormActionProps) => {
    const { t } = useTranslation();
    const { monacoTheme } = useThemeContext();

    const { schema, modelDefinition, showPanel } = props;
    const twinData = twinToFormDataConverter(props.formData, schema);
    const formData = twinData.formData;
    const parseMapTypeError = twinData.error;

    const createTitle = () => {
        const displayName = getLocalizedData(modelDefinition.displayName);
        return (
            <div className="panel-title">
                <h1>{t(ResourceKeys.deviceSettings.panel.title)}</h1>
                <Label>{props.modelDefinition.name} ({displayName ? displayName : '--'})</Label>
            </div>
        );
    };

    const createForm = () => {
        if (parseMapTypeError || !schema) { // Not able to parse interface definition, render raw json editor instead
            return createJsonEditor();
        }
        else {
            return (
                <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                    <Form
                        formData={formData}
                        liveValidate={true}
                        schema={props.schema as any} // tslint:disable-line: no-any
                        showErrorList={false}
                        uiSchema={{'ui:description': props.schema.description, 'ui:disabled': true}}
                        widgets={fabricWidgets}
                        {...fabricFields}
                        ObjectFieldTemplate={ObjectTemplate}
                    >
                        <br/>
                    </Form>
                </ErrorBoundary>
            );
        }
    };

    const createJsonEditor = () => {
        return (
            <form>
                <Label>{t(ResourceKeys.deviceProperties.editor.label, {schema: getSettingSchema()})}</Label>
                <div className="monaco-editor">
                    <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                        <Editor
                            language="json"
                            options={{
                                automaticLayout: true,
                                readOnly: true
                            }}
                            height="70vh"
                            value={JSON.stringify(formData, null, '\t')}
                            theme={monacoTheme}
                        />
                    </React.Suspense>
                </div>
            </form>
        );
    };

    const getSettingSchema = () => {
        return typeof modelDefinition.schema === 'string' ?
            modelDefinition.schema :
            modelDefinition.schema['@type'];
    };

    return (
        <dialog open={showPanel} role="dialog">
            <IconButton
                className="close-dialog-icon"
                iconProps={{ iconName: CLOSE }}
                onClick={props.handleDismiss}
            />
            {createTitle()}
            {createForm()}
        </dialog>
    );
};
