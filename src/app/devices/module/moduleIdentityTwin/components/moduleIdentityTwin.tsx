/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { SpinnerSize, Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
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
import { moduleTwinReducer } from '../reducer';
import { getModuleIdentityTwinSaga } from '../saga';
import { moduleTwinStateInitial } from '../state';
import '../../../../css/_deviceDetail.scss';
import '../../../../css/_moduleIdentityDetail.scss';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export const ModuleIdentityTwin: React.FC = () => {
    const { t } = useLocalizationContext();
    const { monacoTheme } = useThemeContext();
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
                    <div className="monaco-editor">
                        <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                            <Editor
                                language="json"
                                value={JSON.stringify(moduleIdentityTwin, null, '\t')}
                                options={{
                                    automaticLayout: true,
                                    readOnly: true
                                }}
                                theme={monacoTheme}
                            />
                        </React.Suspense>
                    </div>
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
