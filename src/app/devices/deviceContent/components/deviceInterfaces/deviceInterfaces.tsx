/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import {
    MessageBar,
    MessageBarType,
} from 'office-ui-fabric-react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ModelDefinitionWithSource } from '../../../../api/models/modelDefinitionWithSource';
import { SynchronizationWrapper } from '../../../../api/models/synchronizationWrapper';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { ThemeContextInterface, ThemeContextConsumer } from '../../../../shared/contexts/themeContext';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import MaskedCopyableTextFieldContainer from '../../../../shared/components/maskedCopyableTextFieldContainer';
import { DigitalTwinHeaderContainer } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export interface DeviceInterfaceProps {
    modelDefinitionWithSource: SynchronizationWrapper<ModelDefinitionWithSource>;
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
                {modelDefinitionWithSource && modelDefinitionWithSource.payload ?
                    <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                        {modelDefinitionWithSource.payload.isModelValid ?
                            <>
                                <Route component={DigitalTwinHeaderContainer} />
                                <section className="pnp-interface-info scrollable-lg">
                                    {this.renderInterfaceInfoDetail(context)}
                                    {this.renderInterfaceViewer()}
                                </section>
                            </> :
                            <section className="pnp-interface-info scrollable-lg">
                                <MessageBar
                                    messageBarType={MessageBarType.error}
                                >
                                    {context.t(ResourceKeys.deviceInterfaces.interfaceNotValid)}
                                </MessageBar>
                                {this.renderInterfaceViewer()}
                            </section>
                        }
                    </ErrorBoundary> :
                    <InterfaceNotFoundMessageBoxContainer/>
                }
            </>
        );
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private readonly renderInterfaceInfoDetail = (context: LocalizationContextInterface) => {
        const { modelDefinitionWithSource } = this.props;
        const source = this.getModelDefinitionSourceText(context);
        const displayName = modelDefinitionWithSource.payload &&
            modelDefinitionWithSource.payload.modelDefinition &&
            getLocalizedData(modelDefinitionWithSource.payload.modelDefinition.displayName) || '--';
        const description = modelDefinitionWithSource.payload &&
            modelDefinitionWithSource.payload.modelDefinition &&
            getLocalizedData(modelDefinitionWithSource.payload.modelDefinition.description) || '--';
        return (
            <>
                <Label className="source"> {context.t(ResourceKeys.deviceInterfaces.columns.source)}: {source}</Label>
                <ActionButton
                    className="configure-button"
                    onClick={this.handleConfigure}
                >
                        {context.t(ResourceKeys.deviceInterfaces.command.configure)}
                </ActionButton>
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.deviceInterfaces.columns.id)}
                    label={context.t(ResourceKeys.deviceInterfaces.columns.id)}
                    value={getInterfaceIdFromQueryString(this.props)}
                    allowMask={false}
                    readOnly={true}
                />
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.deviceInterfaces.columns.displayName)}
                    label={context.t(ResourceKeys.deviceInterfaces.columns.displayName)}
                    value={displayName}
                    allowMask={false}
                    readOnly={true}
                />
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.deviceInterfaces.columns.description)}
                    label={context.t(ResourceKeys.deviceInterfaces.columns.description)}
                    value={description}
                    allowMask={false}
                    readOnly={true}
                />
            </>
        );
    }

    private readonly getModelDefinitionSourceText = (context: LocalizationContextInterface) => {
        const { modelDefinitionWithSource } = this.props;

        switch (modelDefinitionWithSource.payload.source) {
            case REPOSITORY_LOCATION_TYPE.Public:
                return context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label);
            case REPOSITORY_LOCATION_TYPE.Private:
                return context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.private.label);
            case REPOSITORY_LOCATION_TYPE.Device:
                return context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.device.label);
            case REPOSITORY_LOCATION_TYPE.Local:
                return context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.local.labelInElectron);
            default:
                return '--';
        }
    }

    private readonly handleConfigure = () => {
            this.props.settingsVisibleToggle(true);
    }

    private readonly renderInterfaceViewer = () => {
        const modelDefinitionWithSource = this.props.modelDefinitionWithSource.payload;
        return (
            <article className="interface-definition" >
                { modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition &&
                    <div className="monaco-editor">
                        <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                            <ThemeContextConsumer>
                                {(themeContext: ThemeContextInterface) => (
                                    <Editor
                                        language="json"
                                        value={JSON.stringify(modelDefinitionWithSource.modelDefinition, null, '\t')}
                                        options={{
                                            automaticLayout: true,
                                            readOnly: true
                                        }}
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

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }

    private readonly handleClose = () => {
        const path = this.props.match.url.replace(/\/ioTPlugAndPlayDetail\/interfaces\/.*/, ``);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }
}
