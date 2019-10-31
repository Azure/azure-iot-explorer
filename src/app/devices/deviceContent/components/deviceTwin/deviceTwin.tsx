/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Twin } from '../../../../api/models/device';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { UpdateTwinActionParameters } from '../../actions';
import { REFRESH, SAVE } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ThemeContextConsumer, ThemeContextInterface } from '../../../../shared/contexts/themeContext';
import RenderMultiLineShimmer from '../../../../shared/components/multiLineShimmer';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export interface DeviceTwinDataProps {
    twin: Twin;
    twinState: SynchronizationStatus;
}

export interface DeviceTwinDispatchProps {
    getDeviceTwin: (deviceId: string) => void;
    updateDeviceTwin: (parameters: UpdateTwinActionParameters) => void;
    refreshDigitalTwin: (deviceId: string) => void;
}

export interface DeviceTwinState {
    twin: string;
    isDirty: boolean;
    isTwinValid: boolean;
    needsRefresh: boolean;
}

export default class DeviceTwin
    extends React.Component<DeviceTwinDataProps & DeviceTwinDispatchProps & RouteComponentProps, DeviceTwinState> {
    constructor(props: DeviceTwinDataProps & DeviceTwinDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            isDirty: false,
            isTwinValid: true,
            needsRefresh: false,
            twin: JSON.stringify(this.props.twin, null, '\t')
        };
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar(context)}
                        <h3>{context.t(ResourceKeys.deviceTwin.headerText)}</h3>
                        {this.renderTwinViewer()}
                    </>
            )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.getDeviceTwin(getDeviceIdFromQueryString(this.props));
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public static getDerivedStateFromProps(props: DeviceTwinDataProps & DeviceTwinDispatchProps & RouteComponentProps, state: DeviceTwinState): Partial<DeviceTwinState> | null
    {
        if (props.twin && props.twinState !== SynchronizationStatus.working && props.twinState !== SynchronizationStatus.updating) {
            if (!state.isDirty) {
                if (state.needsRefresh && props.twinState === SynchronizationStatus.upserted) {
                    // after device twin has been updated, refresh digital twin
                    props.refreshDigitalTwin(getDeviceIdFromQueryString(props));
                    return {
                        needsRefresh: false,
                        twin: JSON.stringify(props.twin, null, '\t')
                    };
                }
                else {
                    return {
                        twin: JSON.stringify(props.twin, null, '\t')
                    };
                }
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
                    {
                        ariaLabel: context.t(ResourceKeys.deviceTwin.command.save),
                        disabled: !this.state.isDirty || !this.state.isTwinValid,
                        iconProps: {iconName: SAVE},
                        key: SAVE,
                        name: context.t(ResourceKeys.deviceTwin.command.save),
                        onClick: this.handleSave
                    }
                ]}
            />
        );
    }

    private readonly handleRefresh = () => {
        this.setState({
            isDirty: false,
            needsRefresh: false
        });
        this.props.getDeviceTwin(getDeviceIdFromQueryString(this.props));
    }

    private readonly handleSave = () => {
        this.setState({
            isDirty: false,
            isTwinValid: true,
            needsRefresh: true
        });
        this.props.updateDeviceTwin({
            deviceId: getDeviceIdFromQueryString(this.props),
            twin: JSON.parse(this.state.twin)
        });
    }

    private readonly renderTwinViewer = () => {
        if (this.props.twinState === SynchronizationStatus.working) {
            return <RenderMultiLineShimmer className="device-detail"/>;
        }

        const twin = this.state.twin;
        return (
            <article className="interface-definition device-detail">
                { twin &&
                    <div className="monaco-editor">
                        <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                            <ThemeContextConsumer>
                                {(themeContext: ThemeContextInterface) => (
                                    <Editor
                                        language="json"
                                        height="calc(100vh - 300px)"
                                        value={twin}
                                        options={{
                                            automaticLayout: true,
                                            readOnly: false
                                        }}
                                        onChange={this.onChange}
                                        theme={themeContext.monacoTheme}
                                    />
                                )}
                            </ThemeContextConsumer>
                        </React.Suspense>
                    </div>
                }
            </article>
        );
    }

    private readonly onChange = (data: string) => {
        let isTwinValid = true;
        try {
            JSON.parse(data);
        }
        catch  {
            isTwinValid = false;
        }
        this.setState({
            isDirty: true,
            isTwinValid,
            twin: data
        });
    }
}
