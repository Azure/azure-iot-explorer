/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Panel, PanelType } from '@fluentui/react';
import { Form as MaterialForm } from '@rjsf/material-ui';
import { Form as FluentForm } from '@rjsf/fluent-ui';
import validator from '@rjsf/validator-ajv8';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ParsedJsonSchema } from '../../../api/models/interfaceJsonParserOutput';
import { PropertyContent } from '../../../api/models/modelDefinition';
import { ErrorBoundary } from './errorBoundary';
import { getLocalizedData } from '../../../api/dataTransforms/modelDefinitionTransform';
import { containsMapsInSchema } from './dataForm';

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
    const { modelDefinition, showPanel, formData } = props;

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
        const uiSchema: any = {'ui:description': props.schema?.description, 'ui:disabled': true}; // tslint:disable-line: no-any
        let form: JSX.Element;
        if (containsMapsInSchema(props.schema)) { // FluentForm does not support map (additionalProperties yet)
            form = (
                <MaterialForm
                    formData={formData}
                    liveValidate={true}
                    schema={props.schema as any} // tslint:disable-line: no-any
                    showErrorList={false}
                    uiSchema={uiSchema}
                    validator={validator}
                >
                    <br/>
                </MaterialForm>
            );
        }
        else {
            form = (
                <FluentForm
                    formData={formData}
                    liveValidate={true}
                    schema={props.schema as any} // tslint:disable-line: no-any
                    showErrorList={false}
                    uiSchema={uiSchema}
                    validator={validator}
                >
                    <br/>
                </FluentForm>
            );
        }

        return (
            <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                {form}
            </ErrorBoundary>
        );
    };

    return (
        <Panel isOpen={showPanel} onDismiss={props.handleDismiss} type={PanelType.large} isLightDismiss={true}>
            {createTitle()}
            {createForm()}
        </Panel>
    );
};
