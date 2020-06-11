/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { SpinnerSize, Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { useThemeContext } from '../../../../shared/contexts/themeContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { getModuleIdentityTwinAction } from '../actions';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { ModuleIdentityDetailHeader } from '../../shared/components/moduleIdentityDetailHeader';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { JSONEditor } from '../../../../shared/components/jsonEditor';
import { moduleTwinReducer } from '../reducer';
import { getModuleIdentityTwinSaga } from '../saga';
import { moduleTwinStateInitial } from '../state';
import '../../../../css/_deviceDetail.scss';
import '../../../../css/_moduleIdentityDetail.scss';

export const ModuleIdentityTwin: React.FC = () => {
    const { t } = useTranslation();
    const { editorTheme } = useThemeContext();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);

    const [ localState, dispatch ] = useAsyncSagaReducer(moduleTwinReducer, getModuleIdentityTwinSaga, moduleTwinStateInitial());
    const moduleIdentityTwin = localState.payload;
    const moduleIdentityTwinSyncStatus = localState.synchronizationStatus;

    React.useEffect(() => {
        retrieveData();
    },              [moduleId]);

    const retrieveData = () => dispatch(getModuleIdentityTwinAction.started({ deviceId, moduleId }));

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
                    }
                ]}
                farItems={[
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.detail.command.back),
                        iconProps: {iconName: NAVIGATE_BACK},
                        key: NAVIGATE_BACK,
                        name: t(ResourceKeys.moduleIdentity.detail.command.back),
                        onClick: navigateToModuleList
                    }
                ]}
            />
        );
    };

    const showModuleTwin = () => {
        return (
            <>
                {moduleIdentityTwin &&
                    <JSONEditor
                        content={JSON.stringify(moduleIdentityTwin, null, '\t')}
                        className="json-editor"
                    />
                }
            </>
        );
    };

    const navigateToModuleList = () => {
        const path = pathname.replace(/\/moduleIdentity\/moduleTwin\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    return (
        <>
            {showCommandBar()}
            <Route component={ModuleIdentityDetailHeader} />
            <div className="module-identity-detail">
                {moduleIdentityTwinSyncStatus === SynchronizationStatus.working ?
                    <MultiLineShimmer/> :
                    showModuleTwin()
                }
            </div>
        </>
    );
};
