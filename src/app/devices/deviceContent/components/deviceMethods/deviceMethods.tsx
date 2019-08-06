/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Slider, SliderBase } from 'office-ui-fabric-react/lib/Slider';
import Editor from 'react-monaco-editor';
import { DeviceIdentityWrapper } from '../../../../api/models/deviceIdentityWrapper';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InvokeMethodParameters } from '../../../../api/parameters/deviceParameters';
import '../../../../css/_deviceDetail.scss';

const SLIDER_MAX = 300;
const SLIDER_MIN = 0;

export interface DeviceMethodInvokeProperties {
    connectionTimeout: number;
    methodName: string;
    methodTimeout: number;
    payload: string;
}

export interface DeviceMethodsProps {
    deviceIdentity: DeviceIdentityWrapper;
    connectionString: string;
    invokeMethodResponse: string;
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
            methodTimeout: 0,
            payload: ''
        };
    }

    public render(): JSX.Element {
        const { deviceIdentity } = this.props;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="device-detail">
                        {deviceIdentity && deviceIdentity.deviceIdentity && this.renderMethodsPayloadSection(context)}
                        <PrimaryButton onClick={this.onInvokeMethodClick} disabled={!this.formReady()}>
                            {context.t(ResourceKeys.deviceMethods.invokeMethodButtonText)}
                        </PrimaryButton>
                        <hr />
                        {this.renderMethodsResultSection(context)}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly formReady = (): boolean => {
        const { methodName, payload } = this.state;

        return !!methodName;
    }

    private readonly onInvokeMethodClick = () => {
        const { connectionTimeout, methodName, methodTimeout, payload } = this.state;
        const { connectionString, deviceIdentity } = this.props;

        let parsedPayload;

        try {
            parsedPayload = JSON.parse(payload) || {};
        } catch (e) {
            parsedPayload = {};
        }

        this.props.onInvokeMethodClick({
            connectTimeoutInSeconds: connectionTimeout,
            connectionString,
            deviceId: deviceIdentity.deviceIdentity.deviceId,
            methodName,
            payload: parsedPayload,
            responseTimeoutInSeconds: methodTimeout
        });
    }

    private readonly renderMethodsResultSection = (context: LocalizationContextInterface) => {
        const { invokeMethodResponse } = this.props;
        return (
            <Editor
                language="json"
                height="30vh"
                value={invokeMethodResponse}
                options={{
                    automaticLayout: true,
                    readOnly: true
                }}
            />
        );
    }

    private readonly renderMethodsPayloadSection = (context: LocalizationContextInterface) => {
        const { connectionTimeout, methodName, methodTimeout, payload } = this.state;

        return (
            <div>
                <TextField
                    label={context.t(ResourceKeys.deviceIdentity.deviceID)}
                    disabled={true}
                    defaultValue={this.props.deviceIdentity.deviceIdentity.deviceId}
                />
                <TextField
                    label={context.t(ResourceKeys.deviceMethods.methodName)}
                    value={methodName}
                    onChange={this.onMethodNameChange}
                />
                <br/>
                <Editor
                    language="json"
                    options={{
                        automaticLayout: true
                    }}
                    height="30vh"
                    value={payload}
                    onChange={this.onEditorChange}
                />
                <Slider
                    label={context.t(ResourceKeys.deviceMethods.connectionTimeout)}
                    min={0}
                    max={SLIDER_MAX}
                    ref={this.connectionSliderRef}
                    value={connectionTimeout}
                    onChange={this.onConnectionTimeoutChange}
                />
                <Slider
                    label={context.t(ResourceKeys.deviceMethods.methodTimeout)}
                    min={connectionTimeout}
                    max={SLIDER_MAX}
                    value={methodTimeout}
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
            methodTimeout: value
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
