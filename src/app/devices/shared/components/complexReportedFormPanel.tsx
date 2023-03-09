/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Panel, PanelType } from '@fluentui/react';
import Form from '@rjsf/fluent-ui';
import validator from '@rjsf/validator-ajv8';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { twinToFormDataConverter } from '../../../shared/utils/twinAndJsonSchemaDataConverter';
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
                        validator={validator}
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
        <Panel isOpen={showPanel} onDismiss={props.handleDismiss} type={PanelType.medium} isLightDismiss={true}>
            {createTitle()}
            {createForm()}
        </Panel>
    );
};
