/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Slider } from '@fluentui/react';
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
            <TextField
                label={t(ResourceKeys.directMethod.methodName)}
                ariaLabel={t(ResourceKeys.directMethod.methodName)}
                value={methodName}
                onChange={onMethodNameChange}
                required={true}
                placeholder={t(ResourceKeys.directMethod.methodNamePlaceHolder)}
            />
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
                <TextField className="payload-input" multiline={true} rows={textFieldRows} onChange={onTextFieldChange}/>
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.directMethod.connectionTimeoutTooltip)}
                >
                    {t(ResourceKeys.directMethod.connectionTimeout)}
                </LabelWithTooltip>
                <Slider
                    ariaLabel={t(ResourceKeys.directMethod.connectionTimeout)}
                    min={0}
                    max={SLIDER_MAX}
                    value={connectionTimeOut}
                    onChange={onConnectionTimeoutChange}
                />
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.directMethod.responseTimeoutTooltip)}
                >
                    {t(ResourceKeys.directMethod.responseTimeout)}
                </LabelWithTooltip>
                <Slider
                    ariaLabel={t(ResourceKeys.directMethod.responseTimeout)}
                    min={connectionTimeOut}
                    max={SLIDER_MAX}
                    value={responseTimeOut}
                    onChange={onMethodTimeoutChange}
                />
            </div>
        );
    };

    const onTextFieldChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string) => setPayload(newText);

    const onConnectionTimeoutChange = (value: number) => {
        setConnectionTimeOut(value);
        setResponseTimeOut(Math.max(responseTimeOut, value));
    };

    const onMethodTimeoutChange = (value: number) => setResponseTimeOut(value);

    const onMethodNameChange = (event: React.FormEvent, value?: string) => setMethodName(value);

    return (
        <>
            <div className="device-detail">
                {renderMethodsName()}
                {renderMethodsPayloadSection()}
            </div>
        </>
    );
};
