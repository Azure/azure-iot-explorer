/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ModelDefinitionWithSource } from '../../../../api/models/modelDefinitionWithSource';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import MaskedCopyableTextFieldContainer from '../../../../shared/components/maskedCopyableTextFieldContainer';
import { DigitalTwinHeaderContainer } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';
import { MonacoEditorView } from '../../../../shared/components/monacoEditor';
import { ModelDefinitionSourceView } from '../shared/modelDefinitionSource';
import '../../../../css/_deviceInterface.scss';

export interface DeviceInterfaceProps {
    modelDefinitionWithSource: ModelDefinitionWithSource;
    isLoading: boolean;
}

export interface DeviceInterfaceDispatchProps {
    setComponentName: (id: string) => void;
    settingsVisibleToggle: (visible: boolean) => void;
    refresh: (deviceId: string, interfaceId: string) => void;
}

export default class DeviceInterfaces extends React.Component<DeviceInterfaceProps & DeviceInterfaceDispatchProps & RouteComponentProps, {}> {
    constructor(props: DeviceInterfaceProps & DeviceInterfaceDispatchProps & RouteComponentProps) {
        super(props);

    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    this.props.isLoading ? <MultiLineShimmer/> :
                    <>
                        <CommandBar
                            className="command"
                            items={[
                                {
                                    ariaLabel: context.t(ResourceKeys.deviceInterfaces.command.refresh),
                                    iconProps: {iconName: REFRESH},
                                    key: REFRESH,
                                    name: context.t(ResourceKeys.deviceProperties.command.refresh),
                                    onClick: this.handleRefresh
                                }
                            ]}
                            farItems={[
                                {
                                    ariaLabel: context.t(ResourceKeys.deviceInterfaces.command.close),
                                    iconProps: {iconName: NAVIGATE_BACK},
                                    key: NAVIGATE_BACK,
                                    name: context.t(ResourceKeys.deviceInterfaces.command.close),
                                    onClick: this.handleClose
                                }
                            ]}
                        />
                        {this.renderInterfaceInfo(context)}
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.setComponentName(getComponentNameFromQueryString(this.props));
    }

    private readonly renderInterfaceInfo = (context: LocalizationContextInterface) => {
        const {  modelDefinitionWithSource } = this.props;
        return (
            <>
                {modelDefinitionWithSource ?
                    <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                        {modelDefinitionWithSource.isModelValid ?
                            <>
                                <Route component={DigitalTwinHeaderContainer} />
                                <section className="pnp-interface-info scrollable-lg">
                                    {this.renderInterfaceInfoDetail(context, true)}
                                    {this.renderInterfaceViewer(true)}
                                </section>
                            </> :
                            <section className="pnp-interface-info scrollable-lg">
                                {this.renderInterfaceInfoDetail(context, false)}
                                <MessageBar messageBarType={MessageBarType.error}>
                                    {context.t(ResourceKeys.deviceInterfaces.interfaceNotValid)}
                                </MessageBar>
                                {this.renderInterfaceViewer(false)}
                            </section>
                        }
                    </ErrorBoundary> :
                    <InterfaceNotFoundMessageBoxContainer/>
                }
            </>
        );
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private readonly renderInterfaceInfoDetail = (context: LocalizationContextInterface, isValidInterface: boolean) => {
        const { modelDefinitionWithSource } = this.props;
        return (
            <>
                <ModelDefinitionSourceView
                    handleConfigure={this.handleConfigure}
                    source={modelDefinitionWithSource.source}
                />
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.deviceInterfaces.columns.id)}
                    label={context.t(ResourceKeys.deviceInterfaces.columns.id)}
                    value={getInterfaceIdFromQueryString(this.props)}
                    allowMask={false}
                    readOnly={true}
                />
                {isValidInterface &&
                <>
                    <MaskedCopyableTextFieldContainer
                        ariaLabel={context.t(ResourceKeys.deviceInterfaces.columns.displayName)}
                        label={context.t(ResourceKeys.deviceInterfaces.columns.displayName)}
                        value={modelDefinitionWithSource.modelDefinition && getLocalizedData(modelDefinitionWithSource.modelDefinition.displayName) || '--'}
                        allowMask={false}
                        readOnly={true}
                    />
                    <MaskedCopyableTextFieldContainer
                        ariaLabel={context.t(ResourceKeys.deviceInterfaces.columns.description)}
                        label={context.t(ResourceKeys.deviceInterfaces.columns.description)}
                        value={modelDefinitionWithSource.modelDefinition && getLocalizedData(modelDefinitionWithSource.modelDefinition.description) || '--'}
                        allowMask={false}
                        readOnly={true}
                    />
                </>
                }
            </>
        );
    }

    private readonly handleConfigure = () => {
            this.props.settingsVisibleToggle(true);
    }

    private readonly renderInterfaceViewer = (isValidInterface: boolean) => {
        const { modelDefinitionWithSource } = this.props;
        return (
            <>
                { modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition &&
                    <MonacoEditorView
                        className={`${isValidInterface ? 'interface-definition-monaco-editor' : 'invalid-interface-definition-monaco-editor'}`}
                        content={modelDefinitionWithSource.modelDefinition}
                    />
                }
            </>
        );
    }

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }

    private readonly handleClose = () => {
        const path = this.props.match.url.replace(/\/ioTPlugAndPlayDetail\/interfaces\/.*/, ``);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }
}
