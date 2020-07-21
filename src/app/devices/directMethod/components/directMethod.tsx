/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { TextField } from 'office-ui-fabric-react/lib/components/TextField';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Slider } from 'office-ui-fabric-react/lib/components/Slider';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { DIRECT_METHOD } from '../../../constants/iconNames';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { HeaderView } from '../../../shared/components/headerView';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { JSONEditor } from '../../../shared/components/jsonEditor';
import { invokeDirectMethodSaga } from '../saga';
import { invokeDirectMethodAction } from '../actions';
import '../../../css/_deviceDetail.scss';

const SLIDER_MAX = 300;
const DEFAULT_TIMEOUT = 10;

export const DirectMethod: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);

    const [ , dispatch ] = useAsyncSagaReducer(() => undefined, invokeDirectMethodSaga, undefined);
    const [connectionTimeOut, setConnectionTimeOut] = React.useState<number>(DEFAULT_TIMEOUT);
    const [methodName, setMethodName] = React.useState<string>('');
    const [payload, setPayload] = React.useState<string>('');
    const [responseTimeOut, setResponseTimeOut] = React.useState<number>(DEFAULT_TIMEOUT);

    const showCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.directMethod.invokeMethodButtonText),
                        disabled: !formReady(),
                        iconProps: {iconName: DIRECT_METHOD},
                        key: DIRECT_METHOD,
                        name: t(ResourceKeys.directMethod.invokeMethodButtonText),
                        onClick: onInvokeMethodClickHandler
                    }
                ]}
            />
        );
    };

    const formReady = (): boolean => !!methodName;
    const getPayload = (content: string) => {
        // payload could be json or simply string
        try {
            return JSON.parse(content);
        } catch {
            return content;
        }
    };

    const onInvokeMethodClickHandler = () => {
        dispatch(invokeDirectMethodAction.started({
            connectTimeoutInSeconds: connectionTimeOut,
            deviceId,
            methodName,
            payload: getPayload(payload),
            responseTimeoutInSeconds: responseTimeOut
        }));
    };

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
            {showCommandBar()}
            <HeaderView
                headerText={ResourceKeys.directMethod.headerText}
                tooltip={ResourceKeys.directMethod.tooltip}
            />
            <div className="device-detail">
                {renderMethodsName()}
                {renderMethodsPayloadSection()}
            </div>
        </>
    );
};
