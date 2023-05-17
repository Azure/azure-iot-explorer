/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CommandBar, MessageBar, MessageBarType } from '@fluentui/react';
import { useLocation, useHistory } from 'react-router-dom';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { InterfaceNotFoundMessageBar } from '../../../shared/components/interfaceNotFoundMessageBar';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { getLocalizedData } from '../../../../api/dataTransforms/modelDefinitionTransform';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import { JSONEditor } from '../../../../shared/components/jsonEditor';
import { ModelDefinitionSourceView } from '../../../shared/components/modelDefinitionSource';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getBackUrl } from '../../utils';
import { AppInsightsClient } from '../../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../../../../app/constants/telemetry';
import '../../../../css/_deviceInterface.scss';

export const DeviceInterfaces: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const interfaceId = getInterfaceIdFromQueryString(search);

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
            <div className="pnp-interface-info-detail">
                <ModelDefinitionSourceView
                    source={modelDefinitionWithSource.source}
                />
                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.deviceInterfaces.columns.id)}
                    label={t(ResourceKeys.deviceInterfaces.columns.id)}
                    value={interfaceId}
                    allowMask={false}
                />
                {isValidInterface &&
                    <>
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceInterfaces.columns.displayName)}
                            label={t(ResourceKeys.deviceInterfaces.columns.displayName)}
                            value={modelDefinitionWithSource.modelDefinition && getLocalizedData(modelDefinitionWithSource.modelDefinition.displayName) || '--'}
                            allowMask={false}
                        />
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceInterfaces.columns.description)}
                            label={t(ResourceKeys.deviceInterfaces.columns.description)}
                            value={modelDefinitionWithSource.modelDefinition && getLocalizedData(modelDefinitionWithSource.modelDefinition.description) || '--'}
                            allowMask={false}
                        />
                    </>
                }
            </div>
        );
    };

    const renderInterfaceViewer = (isValidInterface: boolean) => {
        return (
            <div className="pnp-interface-info-editor">
                { modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition &&
                    <JSONEditor
                        className={`${isValidInterface ? 'interface-definition-json-editor' : 'invalid-interface-definition-json-editor'}`}
                        content={JSON.stringify(modelDefinitionWithSource.modelDefinition, null, '\t')}
                    />
                }
            </div>
        );
    };

    const handleClose = () => {
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/interfaces\/.*/, ``);
        history.push(getBackUrl(path, search));
    };

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.PNP_INTERFACES});
    }, []); // tslint:disable-line: align

    return (isLoading ? <MultiLineShimmer/> : (
        <>
            <CommandBar
                className="command deviceInterface-command"
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
