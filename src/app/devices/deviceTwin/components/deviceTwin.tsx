/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { useLocalizationContext } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { getDeviceTwinAction, updateDeviceTwinAction } from '../actions';
import { REFRESH, SAVE } from '../../../constants/iconNames';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { useThemeContext } from '../../../shared/contexts/themeContext';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { HeaderView } from '../../../shared/components/headerView';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { deviceTwinReducer } from '../reducer';
import { deviceTwinSaga } from '../saga';
import { deviceTwinStateInitial } from '../state';
import '../../../css/_deviceTwin.scss';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export const DeviceTwin: React.FC = () => {
    const { t } = useLocalizationContext();
    const { monacoTheme } = useThemeContext();
    const { search } = useLocation();

    const [ localState, dispatch ] = useAsyncSagaReducer(deviceTwinReducer, deviceTwinSaga, deviceTwinStateInitial());
    const twin = localState.deviceTwin && localState.deviceTwin.payload;
    const twinState = localState.deviceTwin && localState.deviceTwin.synchronizationStatus;
    const deviceId = getDeviceIdFromQueryString(search);
    const [ state, setState ] = React.useState({
        isDirty: false,
        isTwinValid: true,
        needsRefresh: false,
        twin: JSON.stringify(twin, null, '\t')
    });

    React.useEffect(() => {
        dispatch(getDeviceTwinAction.started(deviceId));
    },              []);

    // tslint:disable-next-line:cyclomatic-complexity
    React.useEffect(() => {
        if (twin && twinState !== SynchronizationStatus.working && twinState !== SynchronizationStatus.updating) {
            if (!state.isDirty) {
                if (state.needsRefresh && twinState === SynchronizationStatus.upserted) {
                    setState ({
                        ...state,
                        needsRefresh: false,
                        twin: JSON.stringify(twin, null, '\t')
                    });
                }
                else {
                    setState({
                        ...state,
                        twin: JSON.stringify(twin, null, '\t')
                    });
                }
            }
        }

    },              [state.isDirty, state.needsRefresh, twinState]) ;

    const showCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.deviceTwin.command.refresh),
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: t(ResourceKeys.deviceTwin.command.refresh),
                        onClick: handleRefresh
                    },
                    {
                        ariaLabel: t(ResourceKeys.deviceTwin.command.save),
                        disabled: !state.isDirty || !state.isTwinValid,
                        iconProps: {iconName: SAVE},
                        key: SAVE,
                        name: t(ResourceKeys.deviceTwin.command.save),
                        onClick: handleSave
                    }
                ]}
            />
        );
    };

    const handleRefresh = () => {
        setState({
            ...state,
            isDirty: false,
            needsRefresh: false
        });
        dispatch(getDeviceTwinAction.started(deviceId));
    };

    const handleSave = () => {
        setState({
            ...state,
            isDirty: false,
            isTwinValid: true,
            needsRefresh: true
        });
        dispatch(updateDeviceTwinAction.started({
            deviceId,
            twin: JSON.parse(state.twin)
        }));
    };

    const renderTwinViewer = () => {
        if (twinState === SynchronizationStatus.working) {
            return <MultiLineShimmer className="device-detail"/>;
        }

        return (
            <article className="device-twin device-detail">
                { twin &&
                    <div className="monaco-editor">
                        <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                            <Editor
                                language="json"
                                value={state.twin}
                                options={{
                                    automaticLayout: true,
                                    readOnly: false
                                }}
                                onChange={onChange}
                                theme={monacoTheme}
                            />
                        </React.Suspense>
                    </div>
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
            <HeaderView
                headerText={ResourceKeys.deviceTwin.headerText}
                tooltip={ResourceKeys.deviceTwin.tooltip}
            />
            {renderTwinViewer()}
        </>
    );
};
