/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, useLocation, useHistory } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { SpinnerSize, Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { useThemeContext } from '../../../../shared/contexts/themeContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { GetModuleIdentityTwinActionParameters } from '../../actions';
import { ModuleTwin } from '../../../../api/models/moduleTwin';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { ModuleIdentityDetailHeaderView } from './moduleIdentityDetailHeaderView';
import '../../../../css/_deviceDetail.scss';
import '../../../../css/_moduleIdentityDetail.scss';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export interface ModuleIdentityTwinDataProps {
    moduleIdentityTwin: ModuleTwin;
    moduleIdentityTwinSyncStatus: SynchronizationStatus;
}

export interface ModuleIdentityTwinDispatchProps {
    getModuleIdentityTwin: (params: GetModuleIdentityTwinActionParameters) => void;
}

export type ModuleIdentityDetailProps = ModuleIdentityTwinDataProps & ModuleIdentityTwinDispatchProps;
export const ModuleIdentityDetailComponent: React.FC<ModuleIdentityDetailProps> = (props: ModuleIdentityDetailProps) => {
    const { t } = useLocalizationContext();
    const { monacoTheme } = useThemeContext();
    const { search, pathname } = useLocation();
    const history = useHistory();
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const deviceId = getDeviceIdFromQueryString(search);

    const { getModuleIdentityTwin, moduleIdentityTwin, moduleIdentityTwinSyncStatus } = props;

    React.useEffect(() => {
        retrieveData();
    },              [moduleId]);

    const retrieveData = () => getModuleIdentityTwin({ deviceId, moduleId });

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
            <Route component={ModuleIdentityDetailHeaderView} />
            <div className="module-identity-detail">
                {moduleIdentityTwinSyncStatus === SynchronizationStatus.working ?
                    <MultiLineShimmer/> :
                    showModuleTwin()
                }
            </div>
        </>
    );
};
