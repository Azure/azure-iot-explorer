/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { useLocation, useHistory } from 'react-router-dom';
import { useLocalizationContext } from '../../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../../shared/utils/queryStringHelper';
import { InterfaceNotFoundMessageBar } from '../../../shared/components/interfaceNotFoundMessageBar';
import { REFRESH, NAVIGATE_BACK } from '../../../../../constants/iconNames';
import ErrorBoundary from '../../../../shared/components/errorBoundary';
import { getLocalizedData } from '../../../../../api/dataTransforms/modelDefinitionTransform';
import MultiLineShimmer from '../../../../../shared/components/multiLineShimmer';
import { MaskedCopyableTextField } from '../../../../../shared/components/maskedCopyableTextField';
import { ROUTE_PARAMS } from '../../../../../constants/routes';
import { MonacoEditorView } from '../../../../../shared/components/monacoEditor';
import { ModelDefinitionSourceView } from '../../../shared/components/modelDefinitionSource';
import { usePnpStateContext } from '../../pnpStateContext';
import { SynchronizationStatus } from '../../../../../api/models/synchronizationStatus';
import '../../../../../css/_deviceInterface.scss';

export const DeviceInterfaces: React.FC = () => {
    const { t } = useLocalizationContext();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const interfaceId = getInterfaceIdFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);

    const { pnpState, getModelDefinition } = usePnpStateContext();
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const isLoading = pnpState.modelDefinitionWithSource.synchronizationStatus === SynchronizationStatus.working;

    const renderInterfaceInfo = () => {
        return (
            <>
                {modelDefinitionWithSource ?
                    <ErrorBoundary error={t(ResourceKeys.errorBoundary.text)}>
                        {modelDefinitionWithSource.isModelValid ?
                            <>
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

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/interfaces\/.*/, ``);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    return (isLoading ? <MultiLineShimmer/> : (
        <>
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.deviceInterfaces.command.refresh),
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: t(ResourceKeys.deviceProperties.command.refresh),
                        onClick: getModelDefinition
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
