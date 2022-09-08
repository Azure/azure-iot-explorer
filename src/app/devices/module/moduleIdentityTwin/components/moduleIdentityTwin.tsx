/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { CommandBar } from '@fluentui/react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, SAVE } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getModuleIdentityTwinAction, updateModuleIdentityTwinAction } from '../actions';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { JSONEditor } from '../../../../shared/components/jsonEditor';
import { moduleTwinReducer } from '../reducer';
import { moduleIdentityTwinSagas } from '../saga';
import { moduleTwinStateInitial } from '../state';
import '../../../../css/_deviceDetail.scss';
import { AppInsightsClient } from '../../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES, TELEMETRY_USER_ACTIONS } from '../../../../../app/constants/telemetry';

export const ModuleIdentityTwin: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);

    const [ localState, dispatch ] = useAsyncSagaReducer(moduleTwinReducer, moduleIdentityTwinSagas, moduleTwinStateInitial(), 'moduleIdentityTwinState');
    const moduleIdentityTwin = localState.payload;
    const moduleIdentityTwinSyncStatus = localState.synchronizationStatus;
    const [ state, setState ] = React.useState({
        isDirty: false,
        isTwinValid: true,
        twin: JSON.stringify(moduleIdentityTwin, null, '\t')
    });

    React.useEffect(() => {
        retrieveData();
    },              [deviceId, moduleId]);

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.MODULE_TWIN});
    }, []); // tslint:disable-line: align

    const retrieveData = () => dispatch(getModuleIdentityTwinAction.started({ deviceId, moduleId }));

    const handleSave = () => {
        setState({
            ...state,
            isDirty: false,
            isTwinValid: true
        });
        AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.UPDATE_MODULE_TWIN);
        dispatch(updateModuleIdentityTwinAction.started(JSON.parse(state.twin)));
    };

    const showCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        disabled: moduleIdentityTwinSyncStatus === SynchronizationStatus.working,
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        onClick: retrieveData
                    },
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.detail.command.save),
                        disabled: !state.isDirty || !state.isTwinValid,
                        iconProps: {iconName: SAVE},
                        key: SAVE,
                        name: t(ResourceKeys.moduleIdentity.detail.command.save),
                        onClick: handleSave
                    }
                ]}
            />
        );
    };

    const showModuleTwin = () => {
        if (moduleIdentityTwinSyncStatus === SynchronizationStatus.working || moduleIdentityTwinSyncStatus === SynchronizationStatus.updating) {
            return <MultiLineShimmer/>;
        }

        return (
            <article className="device-twin">
                {moduleIdentityTwin &&
                    <JSONEditor
                        content={JSON.stringify(moduleIdentityTwin, null, '\t')}
                        className="json-editor"
                        onChange={onChange}
                    />
                }
            </article>
        );
    };

    const onChange = (data: string) => {
        let isTwinValid = true;
        try {
            JSON.parse(data);
        }
        catch  {
            isTwinValid = false;
        }
        setState({
            ...state,
            isDirty: true,
            isTwinValid,
            twin: data
        });
    };

    return (
        <>
            {showCommandBar()}
            <div className="device-detail">
                {moduleIdentityTwinSyncStatus === SynchronizationStatus.working ?
                    <MultiLineShimmer/> :
                    showModuleTwin()
                }
            </div>
        </>
    );
};
