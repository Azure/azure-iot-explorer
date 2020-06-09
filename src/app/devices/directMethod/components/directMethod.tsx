/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { useLocalizationContext } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { DIRECT_METHOD } from '../../../constants/iconNames';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { useThemeContext } from '../../../shared/contexts/themeContext';
import { HeaderView } from '../../../shared/components/headerView';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { invokeDirectMethodSaga } from '../saga';
import { invokeDirectMethodAction } from '../actions';
import '../../../css/_deviceDetail.scss';

const SLIDER_MAX = 300;
const DEFAULT_TIMEOUT = 10;

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export const DirectMethod: React.FC = () => {
    const { t } = useLocalizationContext();
    const { monacoTheme } = useThemeContext();
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

    const formReady = (): boolean => !!methodName && (!payload || isValidJson(payload));

    const isValidJson = (content: string) => {
        try {
            JSON.parse(content);
            return true;
        } catch {
            return false;
        }
    };

    const onInvokeMethodClickHandler = () => {
        dispatch(invokeDirectMethodAction.started({
            connectTimeoutInSeconds: connectionTimeOut,
            deviceId,
            methodName,
            payload: payload ? JSON.parse(payload) : {},
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
        return (
            <div className="method-payload">
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.directMethod.payloadTooltip)}
                >
                    {t(ResourceKeys.directMethod.payload)}
                </LabelWithTooltip>
                <div className="direct-method-monaco-editor">
                    <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                        <Editor
                            language="json"
                            options={{
                                automaticLayout: true
                            }}
                            height="25vh"
                            value={payload}
                            onChange={onEditorChange}
                            theme={monacoTheme}
                        />
                    </React.Suspense>
                </div>
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

    const onEditorChange = (value: string) => setPayload(value);

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
