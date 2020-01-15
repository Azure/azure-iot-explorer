/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Slider, SliderBase } from 'office-ui-fabric-react/lib/Slider';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InvokeMethodActionParameters } from '../../actions';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { DIRECT_METHOD } from '../../../../constants/iconNames';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { ThemeContextConsumer, ThemeContextInterface } from '../../../../shared/contexts/themeContext';
const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);
import { RenderHeaderText } from '../../../../shared/components/headerText';
import '../../../../css/_deviceDetail.scss';

const SLIDER_MAX = 300;

export interface DirectMethodState {
    connectionTimeout: number;
    methodName: string;
    responseTimeout: number;
    payload: string;
}

export interface DirectMethodProps {
    onInvokeMethodClick: (properties: InvokeMethodActionParameters) => void;
}

export default class DirectMethod extends React.Component<DirectMethodProps & RouteComponentProps, DirectMethodState> {

    private connectionSliderRef: React.Ref<SliderBase>;

    constructor(props: DirectMethodProps & RouteComponentProps) {
        super(props);
        this.state = {
            connectionTimeout: 0,
            methodName: '',
            payload: '',
            responseTimeout: 0
        };
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar(context)}
                        {RenderHeaderText(context, ResourceKeys.directMethod.headerText, ResourceKeys.directMethod.tooltip)}
                        <div className="device-detail">
                            {this.renderMethodsName(context)}
                            {this.renderMethodsPayloadSection(context)}
                        </div>
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.directMethod.invokeMethodButtonText),
                        disabled: !this.formReady(),
                        iconProps: {iconName: DIRECT_METHOD},
                        key: DIRECT_METHOD,
                        name: context.t(ResourceKeys.directMethod.invokeMethodButtonText),
                        onClick: this.onInvokeMethodClick
                    }
                ]}
            />
        );
    }

    private readonly formReady = (): boolean => {
        const { methodName, payload } = this.state;
        return !!methodName && (!payload || this.isValidJson(payload));
    }

    private isValidJson = (content: string) => {
        try {
            JSON.parse(content);
            return true;
        } catch {
            return false;
        }
    }

    private readonly onInvokeMethodClick = () => {
        const { connectionTimeout, methodName, responseTimeout, payload } = this.state;

        this.props.onInvokeMethodClick({
            connectTimeoutInSeconds: connectionTimeout,
            deviceId: getDeviceIdFromQueryString(this.props),
            methodName,
            payload: payload ? JSON.parse(payload) : {},
            responseTimeoutInSeconds: responseTimeout
        });
    }

    private readonly renderMethodsName = (context: LocalizationContextInterface) => {
        return (
                <TextField
                    label={context.t(ResourceKeys.directMethod.methodName)}
                    ariaLabel={context.t(ResourceKeys.directMethod.methodName)}
                    value={this.state.methodName}
                    onChange={this.onMethodNameChange}
                    required={true}
                    placeholder={context.t(ResourceKeys.directMethod.methodNamePlaceHolder)}
                />
        );
    }

    private readonly renderMethodsPayloadSection = (context: LocalizationContextInterface) => {
        const { connectionTimeout, responseTimeout, payload } = this.state;

        return (
            <div className="method-payload">
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.directMethod.payloadTooltip)}
                >
                    {context.t(ResourceKeys.directMethod.payload)}
                </LabelWithTooltip>
                <div className="direct-method-monaco-editor">
                    <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                        <ThemeContextConsumer>
                            {(themeContext: ThemeContextInterface) => (
                                <Editor
                                    language="json"
                                    options={{
                                        automaticLayout: true
                                    }}
                                    height="25vh"
                                    value={payload}
                                    onChange={this.onEditorChange}
                                    theme={themeContext.monacoTheme}
                                />
                            )}
                        </ThemeContextConsumer>
                    </React.Suspense>
                </div>
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.directMethod.connectionTimeoutTooltip)}
                >
                    {context.t(ResourceKeys.directMethod.connectionTimeout)}
                </LabelWithTooltip>
                <Slider
                    ariaLabel={context.t(ResourceKeys.directMethod.connectionTimeout)}
                    min={0}
                    max={SLIDER_MAX}
                    ref={this.connectionSliderRef}
                    value={connectionTimeout}
                    onChange={this.onConnectionTimeoutChange}
                />
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.directMethod.responseTimeoutTooltip)}
                >
                    {context.t(ResourceKeys.directMethod.responseTimeout)}
                </LabelWithTooltip>
                <Slider
                    ariaLabel={context.t(ResourceKeys.directMethod.responseTimeout)}
                    min={connectionTimeout}
                    max={SLIDER_MAX}
                    value={responseTimeout}
                    onChange={this.onMethodTimeoutChange}
                />
            </div>
        );
    }

    private readonly onEditorChange = (value: string) => {
        this.setState({
            payload: value
        });
    }

    private readonly onConnectionTimeoutChange = (value: number) => {
        this.setState({
            connectionTimeout: value,
            responseTimeout: Math.max(this.state.responseTimeout, value)
        });
    }

    private readonly onMethodTimeoutChange = (value: number) => {
        this.setState({
            responseTimeout: value
        });
    }

    private readonly onMethodNameChange = (event: React.FormEvent, value?: string) => {
        if (!!value) {
            this.setState({
                methodName: value
            });
        }
    }
}
