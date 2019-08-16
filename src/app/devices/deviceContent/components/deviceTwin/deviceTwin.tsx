/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Editor from 'react-monaco-editor';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Twin } from '../../../../api/models/device';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { UpdateTwinActionParameters } from '../../actions';
import { REFRESH } from '../../../../constants/iconNames';
import '../../../../css/_deviceDetail.scss';

export interface DeviceTwinDataProps {
    twin: Twin;
    isLoading: boolean;
}

export interface DeviceTwinDispatchProps {
    getDeviceTwin: (deviceId: string) => void;
    updateDeviceTwin: (parameters: UpdateTwinActionParameters) => void;
}

export interface DeviceTwinState {
    twin: string;
    isDirty: boolean;
}

export default class DeviceTwin
    extends React.Component<DeviceTwinDataProps & DeviceTwinDispatchProps & RouteComponentProps, DeviceTwinState> {
    constructor(props: DeviceTwinDataProps & DeviceTwinDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            isDirty: false,
            twin: JSON.stringify(this.props.twin, null, '\t')
        };
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar(context)}
                        <h3>{context.t(ResourceKeys.deviceTwin.headerText, {
                            deviceId: getDeviceIdFromQueryString(this.props)
                        })}</h3>
                        {this.renderTwinViewer()}
                    </>
            )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.getDeviceTwin(getDeviceIdFromQueryString(this.props));
    }

    public static getDerivedStateFromProps(props: DeviceTwinDataProps & DeviceTwinDispatchProps & RouteComponentProps, state: DeviceTwinState): Partial<DeviceTwinState> | null {
        if (props.twin) {
            if (!state.isDirty) {
                return {
                    twin: JSON.stringify(props.twin, null, '\t')
                };
            }
        }
        return null;
    }

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.deviceTwin.command.refresh),
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: context.t(ResourceKeys.deviceTwin.command.refresh),
                        onClick: this.handleRefresh
                    },
                    // todo: twin updates
                    // {
                    //     ariaLabel: context.t(ResourceKeys.deviceTwin.command.save),
                    //     iconProps: {iconName: SAVE},
                    //     key: SAVE,
                    //     name: context.t(ResourceKeys.deviceTwin.command.save),
                    //     onClick: this.handleSave
                    // }
                ]}
            />
        );
    }

    private readonly handleRefresh = () => {
        this.setState({
            isDirty: false
        });
        this.props.getDeviceTwin(getDeviceIdFromQueryString(this.props));
    }

    private readonly handleSave = () => {
        this.setState({
            isDirty: false
        });
        this.props.updateDeviceTwin({
            deviceId: getDeviceIdFromQueryString(this.props),
            twin: JSON.parse(this.state.twin)
        });
    }

    private readonly renderTwinViewer = () => {
        if (this.props.isLoading) {
            return (
                <Shimmer className="device-detail"/>
            );
        }

        const twin = this.state.twin;
        return (
            <article className="interface-definition device-detail">
                { twin &&
                    <Editor
                        language="json"
                        height="calc(100vh - 300px)"
                        value={twin}
                        options={{
                            automaticLayout: true,
                            readOnly: true // todo: twin updates
                        }}
                        onChange={this.onChange}
                    />
                }
            </article>
        );
    }

    private readonly onChange = (data: string) => {
        this.setState({
            isDirty: true,
            twin: data
        });
    }
}
