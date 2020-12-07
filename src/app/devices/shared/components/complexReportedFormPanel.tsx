/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import Form from 'react-jsonschema-form';
import { fabricWidgets, fabricFields } from '../../../jsonSchemaFormFabricPlugin';
import { ObjectTemplate } from '../../../jsonSchemaFormFabricPlugin/fields/objectTemplate';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { twinToFormDataConverter } from '../../../shared/utils/twinAndJsonSchemaDataConverter';
import { CLOSE } from '../../../constants/iconNames';
import { PropertyContent } from '../../../api/models/modelDefinition';
import { ErrorBoundary } from './errorBoundary';
import { getLocalizedData } from '../../../api/dataTransforms/modelDefinitionTransform';
import { JSONEditor } from '../../../shared/components/jsonEditor';
import { getSchemaType } from '../../../shared/utils/jsonSchemaAdaptor';

export interface ReportedFormDataProps {
    showPanel: boolean;
    formData: any; // tslint:disable-line:no-any
    schema: ParsedJsonSchema;
    modelDefinition: PropertyContent;
}

export interface ReportedFormActionProps {
    handleDismiss: () => void;
}

export const ComplexReportedFormPanel: React.FC<ReportedFormDataProps & ReportedFormActionProps> = (props: ReportedFormDataProps & ReportedFormActionProps) => {
    const { t } = useTranslation();

    const { schema, modelDefinition, showPanel } = props;
    const twinData = twinToFormDataConverter(props.formData, schema);
    const formData = twinData.formData;
    const parsingSchemaFailed = React.useMemo(() => twinData.error || !schema || (!schema.type && !schema.$ref), [twinData, schema]);

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
        if (parsingSchemaFailed) { // Not able to parse interface definition, render raw json editor instead
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
                <Label>{t(ResourceKeys.deviceProperties.editor.label, {schema: getSchemaType(modelDefinition.schema)})}</Label>
                <JSONEditor className="json-editor" content={JSON.stringify(formData, null, '\t')}/>
            </form>
        );
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
