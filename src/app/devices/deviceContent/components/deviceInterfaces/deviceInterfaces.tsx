/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import Editor from 'react-monaco-editor';
import { Shimmer, CommandBar, Label, DefaultButton } from 'office-ui-fabric-react';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ModelDefinitionWithSourceWrapper } from '../../../../api/models/modelDefinitionWithSourceWrapper';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { REFRESH } from '../../../../constants/iconNames';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';

export interface DeviceInterfaceProps {
    modelDefinitionWithSource: ModelDefinitionWithSourceWrapper;
    isLoading: boolean;
}

export interface DeviceInterfaceDispatchProps {
    setInterfaceId: (id: string) => void;
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
                    this.props.isLoading ? <Shimmer/> :
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
                        />
                        {this.renderInterfaceInfo(context)}
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.setInterfaceId(getInterfaceIdFromQueryString(this.props));
    }

    private readonly renderInterfaceInfo = (context: LocalizationContextInterface) => {
        const {  modelDefinitionWithSource } = this.props;
        return (
            <>
                <h3>{context.t(ResourceKeys.deviceInterfaces.headerText, {
                    interfaceId: getInterfaceIdFromQueryString(this.props)
                })}</h3>
                {modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition ?
                    <ErrorBoundary error={context.t(ResourceKeys.errorBoundary.text)}>
                        <section className="pnp-interface-info">
                            {this.renderInterfaceInfoDetail(context)}
                            {this.renderInterfaceViewer()}
                        </section>
                    </ErrorBoundary> :
                    <InterfaceNotFoundMessageBoxContainer/>
                }
            </>
        );
    }

    private readonly renderInterfaceInfoDetail = (context: LocalizationContextInterface) => {
        const { modelDefinitionWithSource } = this.props;
        const source = this.getModelDefinitionSourceText(context);
        const displayName = modelDefinitionWithSource.modelDefinition && getLocalizedData(modelDefinitionWithSource.modelDefinition.displayName) || '--';
        const description = modelDefinitionWithSource.modelDefinition && getLocalizedData(modelDefinitionWithSource.modelDefinition.description) || '--';
        return (
            <>
                <Label className="source"> {context.t(ResourceKeys.deviceInterfaces.columns.source)}: {source}</Label>
                <DefaultButton
                    className="configure-button"
                    onClick={this.handleConfigure}
                >
                        {context.t(ResourceKeys.deviceInterfaces.command.configure)}
                </DefaultButton>
                <Label> {context.t(ResourceKeys.deviceInterfaces.columns.displayName)}: {displayName}</Label>
                <Label> {context.t(ResourceKeys.deviceInterfaces.columns.description)}: {description}</Label>
            </>
        );
    }

    private readonly getModelDefinitionSourceText = (context: LocalizationContextInterface) => {
        const { modelDefinitionWithSource } = this.props;

        switch (modelDefinitionWithSource.source) {
            case REPOSITORY_LOCATION_TYPE.Public:
                return context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label);
            case REPOSITORY_LOCATION_TYPE.Private:
                return context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.private.label);
            case REPOSITORY_LOCATION_TYPE.Device:
                return context.t(ResourceKeys.settings.modelDefinitions.repositoryTypes.device.label);
            default:
                return '--';
        }
    }

    private readonly handleConfigure = () => {
            this.props.settingsVisibleToggle(true);
    }

    private readonly renderInterfaceViewer = () => {
        const modelDefinition = this.props.modelDefinitionWithSource.modelDefinition;
        return (
            <article className="interface-definition" >
                { modelDefinition &&
                    <Editor
                        language="json"
                        height="calc(100vh - 400px)"
                        value={JSON.stringify(modelDefinition, null, '\t')}
                        options={{
                            automaticLayout: true,
                            readOnly: true
                        }}
                    />
                }
            </article>
        );
    }

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }
}
