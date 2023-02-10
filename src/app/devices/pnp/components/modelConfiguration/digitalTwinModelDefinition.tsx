/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ModelDefinitionSourceView } from '../../../shared/components/modelDefinitionSource';
import { InterfaceNotFoundMessageBar } from '../../../shared/components/interfaceNotFoundMessageBar';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { JSONEditor } from '../../../../shared/components/jsonEditor';
import { DigitalTwinComponentList } from './digitalTwinComponentList';
import './digitalTwinDetail.scss';

export const DigitalTwinModelDefinition: React.FC = () => {
    const { t } = useTranslation();
    const { pnpState } = usePnpStateContext();
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const modelDefinitionSynchronizationStatus = pnpState.modelDefinitionWithSource.synchronizationStatus;
    const isModelDefinitionLoading = modelDefinitionSynchronizationStatus === SynchronizationStatus.working;
    const twin = pnpState.twin.payload;
    const modelId = twin?.modelId;

    const renderModelDefinition = () => {
        if (isModelDefinitionLoading) {
            return <MultiLineShimmer/>;
        }

        return (
            <>
                {modelDefinitionWithSource ?
                    <>
                        <div className="step-two">
                            <h4>{t(ResourceKeys.digitalTwin.steps.secondSuccess)}</h4>
                            <ModelDefinitionSourceView
                                source={modelDefinitionWithSource.source}
                            />
                        </div>
                        <div className="step-three">
                            {modelDefinitionWithSource.isModelValid ?
                                <DigitalTwinComponentList/> :
                                <>
                                    <MessageBar messageBarType={MessageBarType.error}>
                                        {t(ResourceKeys.deviceInterfaces.interfaceNotValid)}
                                    </MessageBar>
                                    <JSONEditor
                                        className="interface-definition-json-editor"
                                        content={JSON.stringify(modelDefinitionWithSource.modelDefinition, null, '\t')}
                                    />
                                </>
                            }
                        </div>
                    </> :
                    <div className="step-two">
                        <h4>{t(ResourceKeys.digitalTwin.steps.secondFailure, {modelId})}</h4>
                        <InterfaceNotFoundMessageBar/>
                    </div>
                }
            </>
        );
    };

    return renderModelDefinition();
};
