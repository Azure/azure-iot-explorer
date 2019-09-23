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
import { InvokeMethodParameters } from '../../../../api/parameters/deviceParameters';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH } from '../../../../constants/iconNames';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import '../../../../css/_deviceDetail.scss';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

const SLIDER_MAX = 300;

export interface DeviceMethodInvokeProperties {
    connectionTimeout: number;
    methodName: string;
    responseTimeout: number;
    payload: string;
}

export interface DeviceMethodsProps {
    connectionString: string;
    onInvokeMethodClick: (properties: InvokeMethodParameters) => void;
}

export type DeviceMethodsState = DeviceMethodInvokeProperties;

export default class DeviceMethods extends React.Component<DeviceMethodsProps & RouteComponentProps, DeviceMethodsState> {

    private connectionSliderRef: React.Ref<SliderBase>;

    constructor(props: DeviceMethodsProps & RouteComponentProps) {
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
                        <h3>{context.t(ResourceKeys.deviceMethods.headerText)}</h3>
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
                        ariaLabel: context.t(ResourceKeys.deviceMethods.invokeMethodButtonText),
                        disabled: !this.formReady(),
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: context.t(ResourceKeys.deviceMethods.invokeMethodButtonText),
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
        const { connectionString } = this.props;

        this.props.onInvokeMethodClick({
            connectTimeoutInSeconds: connectionTimeout,
            connectionString,
            deviceId: getDeviceIdFromQueryString(this.props),
            methodName,
            payload: payload ? JSON.parse(payload) : {},
            responseTimeoutInSeconds: responseTimeout
        });
    }

    private readonly renderMethodsName = (context: LocalizationContextInterface) => {
        return (
                <TextField
                    label={context.t(ResourceKeys.deviceMethods.methodName)}
                    ariaLabel={context.t(ResourceKeys.deviceMethods.methodName)}
                    value={this.state.methodName}
                    onChange={this.onMethodNameChange}
                    required={true}
                    placeholder={context.t(ResourceKeys.deviceMethods.methodNamePlaceHolder)}
                />
        );
    }

    private readonly renderMethodsPayloadSection = (context: LocalizationContextInterface) => {
        const { connectionTimeout, responseTimeout, payload } = this.state;

        return (
            <div className="method-payload">
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.deviceMethods.payloadTooltip)}
                >
                    {context.t(ResourceKeys.deviceMethods.payload)}
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
                            onChange={this.onEditorChange}
                        />
                    </React.Suspense>
                </div>
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.deviceMethods.connectionTimeoutTooltip)}
                >
                    {context.t(ResourceKeys.deviceMethods.connectionTimeout)}
                </LabelWithTooltip>
                <Slider
                    ariaLabel={context.t(ResourceKeys.deviceMethods.connectionTimeout)}
                    min={0}
                    max={SLIDER_MAX}
                    ref={this.connectionSliderRef}
                    value={connectionTimeout}
                    onChange={this.onConnectionTimeoutChange}
                />
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.deviceMethods.responseTimeoutTooltip)}
                >
                    {context.t(ResourceKeys.deviceMethods.responseTimeout)}
                </LabelWithTooltip>
                <Slider
                    ariaLabel={context.t(ResourceKeys.deviceMethods.responseTimeout)}
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
            connectionTimeout: value
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
