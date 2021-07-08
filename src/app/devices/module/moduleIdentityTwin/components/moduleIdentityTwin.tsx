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
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { getModuleIdentityTwinAction, updateModuleIdentityTwinAction } from '../actions';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { JSONEditor } from '../../../../shared/components/jsonEditor';
import { moduleTwinReducer } from '../reducer';
import { moduleIdentityTwinSagas } from '../saga';
import { moduleTwinStateInitial } from '../state';
import '../../../../css/_deviceDetail.scss';
import '../../../../css/_moduleIdentityDetail.scss';

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

    const retrieveData = () => dispatch(getModuleIdentityTwinAction.started({ deviceId, moduleId }));

    const handleSave = () => {
        setState({
            ...state,
            isDirty: false,
            isTwinValid: true
        });
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
            return <MultiLineShimmer className="module-identity-detail"/>;
        }

        return (
            <>
                {moduleIdentityTwin &&
                    <JSONEditor
                        content={JSON.stringify(moduleIdentityTwin, null, '\t')}
                        className="json-editor"
                        onChange={onChange}
                    />
                }
            </>
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

    const navigateToModuleList = () => {
        const path = pathname.replace(/\/moduleIdentity\/moduleTwin\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    return (
        <>
            {showCommandBar()}
            <div className="module-identity-detail">
                {moduleIdentityTwinSyncStatus === SynchronizationStatus.working ?
                    <MultiLineShimmer/> :
                    showModuleTwin()
                }
            </div>
        </>
    );
};
