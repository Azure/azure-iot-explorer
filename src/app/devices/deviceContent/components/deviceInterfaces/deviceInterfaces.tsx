/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ModelDefinitionWithSource } from '../../../../api/models/modelDefinitionWithSource';
import { InterfaceNotFoundMessageBar } from '../shared/interfaceNotFoundMessageBar';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import ErrorBoundary from '../../../errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import { DigitalTwinHeaderView } from '../digitalTwin/digitalTwinHeaderView';
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
    refresh: (deviceId: string, interfaceId: string) => void;
}

export const DeviceInterfaces: React.FC<DeviceInterfaceProps & DeviceInterfaceDispatchProps> = (props: DeviceInterfaceProps & DeviceInterfaceDispatchProps) => {
    const { t } = useLocalizationContext();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const componentName = getComponentNameFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);
    const { setComponentName, modelDefinitionWithSource, refresh } = props;

    React.useEffect(() => {
        setComponentName(componentName);
    },              []);

    const renderInterfaceInfo = () => {
        return (
            <>
                {modelDefinitionWithSource ?
                    <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                        {modelDefinitionWithSource.isModelValid ?
                            <>
                                <Route component={DigitalTwinHeaderView}/>
                                <section className="pnp-interface-info scrollable-lg">
                                    {renderInterfaceInfoDetail(true)}
                                    {renderInterfaceViewer(true)}
                                </section>
                            </> :
                            <section className="pnp-interface-info scrollable-lg">
                                {renderInterfaceInfoDetail(false)}
                                <MessageBar messageBarType={MessageBarType.error}>
                                    {t(ResourceKeys.deviceInterfaces.interfaceNotValid)}
                                </MessageBar>
                                {renderInterfaceViewer(false)}
                            </section>
                        }
                    </ErrorBoundary> :
                    <InterfaceNotFoundMessageBar/>
                }
            </>
        );
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const renderInterfaceInfoDetail = (isValidInterface: boolean) => {
        return (
            <>
                <ModelDefinitionSourceView
                    source={modelDefinitionWithSource.source}
                />
                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.deviceInterfaces.columns.id)}
                    label={t(ResourceKeys.deviceInterfaces.columns.id)}
                    value={interfaceId}
                    allowMask={false}
                    readOnly={true}
                />
                {isValidInterface &&
                    <>
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceInterfaces.columns.displayName)}
                            label={t(ResourceKeys.deviceInterfaces.columns.displayName)}
                            value={modelDefinitionWithSource.modelDefinition && getLocalizedData(modelDefinitionWithSource.modelDefinition.displayName) || '--'}
                            allowMask={false}
                            readOnly={true}
                        />
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceInterfaces.columns.description)}
                            label={t(ResourceKeys.deviceInterfaces.columns.description)}
                            value={modelDefinitionWithSource.modelDefinition && getLocalizedData(modelDefinitionWithSource.modelDefinition.description) || '--'}
                            allowMask={false}
                            readOnly={true}
                        />
                    </>
                }
            </>
        );
    };

    const renderInterfaceViewer = (isValidInterface: boolean) => {
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
    };

    const handleRefresh = () => {
        refresh(deviceId, interfaceId);
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/interfaces\/.*/, ``);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    return (props.isLoading ? <MultiLineShimmer/> : (
        <>
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.deviceInterfaces.command.refresh),
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: t(ResourceKeys.deviceProperties.command.refresh),
                        onClick: handleRefresh
                    }
                ]}
                farItems={[
                    {
                        ariaLabel: t(ResourceKeys.deviceInterfaces.command.close),
                        iconProps: {iconName: NAVIGATE_BACK},
                        key: NAVIGATE_BACK,
                        name: t(ResourceKeys.deviceInterfaces.command.close),
                        onClick: handleClose
                    }
                ]}
            />
            {renderInterfaceInfo()}
        </>)
    );
};
