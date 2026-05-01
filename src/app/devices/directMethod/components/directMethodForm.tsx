/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Field, Input, Slider, Textarea } from '@fluentui/react-components';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import '../../../css/_deviceDetail.scss';

const SLIDER_MAX = 300;

export interface DirectMethodForm {
    methodName: string;
    connectionTimeOut: number;
    responseTimeOut: number;
    setMethodName: (methodName: string) => void;
    setPayload: (payload: string) => void;
    setConnectionTimeOut: (connectionTimeOut: number) => void;
    setResponseTimeOut: (responseTimeOut: number) => void;
}

export const DirectMethodForm: React.FC<DirectMethodForm> = ({
    methodName,
    connectionTimeOut,
    responseTimeOut,
    setMethodName,
    setPayload,
    setConnectionTimeOut,
    setResponseTimeOut
}) => {
    const { t } = useTranslation();

    const renderMethodsName = () => {
        return (
            <Field
                label={t(ResourceKeys.directMethod.methodName)}
                required={true}
            >
                <Input
                    aria-label={t(ResourceKeys.directMethod.methodName)}
                    value={methodName}
                    onChange={onMethodNameChange}
                    placeholder={t(ResourceKeys.directMethod.methodNamePlaceHolder)}
                />
            </Field>
        );
    };

    const renderMethodsPayloadSection = () => {
        const textFieldRows = 5;
        return (
            <div className="method-payload">
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.directMethod.payloadTooltip)}
                >
                    {t(ResourceKeys.directMethod.payload)}
                </LabelWithTooltip>
                <Textarea className="payload-input" rows={textFieldRows} onChange={onTextFieldChange}/>
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.directMethod.connectionTimeoutTooltip)}
                >
                    {t(ResourceKeys.directMethod.connectionTimeout)}
                </LabelWithTooltip>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Slider
                        aria-label={t(ResourceKeys.directMethod.connectionTimeout)}
                        min={0}
                        max={SLIDER_MAX}
                        value={connectionTimeOut}
                        onChange={onConnectionTimeoutChange}
                        style={{ flexGrow: 1 }}
                    />
                    <span>{connectionTimeOut}</span>
                </div>
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.directMethod.responseTimeoutTooltip)}
                >
                    {t(ResourceKeys.directMethod.responseTimeout)}
                </LabelWithTooltip>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Slider
                        aria-label={t(ResourceKeys.directMethod.responseTimeout)}
                        min={0}
                        max={SLIDER_MAX}
                        value={responseTimeOut}
                        onChange={onMethodTimeoutChange}
                        style={{ flexGrow: 1 }}
                    />
                    <span>{responseTimeOut}</span>
                </div>
            </div>
        );
    };

    const onTextFieldChange = (ev: React.ChangeEvent<HTMLTextAreaElement>, data: { value: string }) => setPayload(data.value);

    const onConnectionTimeoutChange = (ev: React.ChangeEvent<HTMLInputElement>, data: { value: number }) => {
        setConnectionTimeOut(data.value);
    };

    const onMethodTimeoutChange = (ev: React.ChangeEvent<HTMLInputElement>, data: { value: number }) => setResponseTimeOut(data.value);

    const onMethodNameChange = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => setMethodName(data.value);

    return (
        <>
            <div className="device-detail">
                {renderMethodsName()}
                {renderMethodsPayloadSection()}
            </div>
        </>
    );
};
