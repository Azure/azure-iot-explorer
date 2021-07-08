/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CommandBar } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { getDeviceTwinAction, updateDeviceTwinAction } from '../actions';
import { REFRESH, SAVE } from '../../../constants/iconNames';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { HeaderView } from '../../../shared/components/headerView';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { JSONEditor } from '../../../shared/components/jsonEditor';
import { deviceTwinReducer } from '../reducer';
import { deviceTwinSaga } from '../saga';
import { deviceTwinStateInitial } from '../state';
import { useBreadcrumbEntry } from '../../../navigation/hooks/useBreadcrumbEntry';
import '../../../css/_deviceTwin.scss';

export const DeviceTwin: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();

    const [ localState, dispatch ] = useAsyncSagaReducer(deviceTwinReducer, deviceTwinSaga, deviceTwinStateInitial(), 'deviceTwinState');
    const twin = localState.deviceTwin && localState.deviceTwin.payload;
    const twinState = localState.deviceTwin && localState.deviceTwin.synchronizationStatus;
    const deviceId = getDeviceIdFromQueryString(search);
    const [ state, setState ] = React.useState({
        isDirty: false,
        isTwinValid: true,
        twin: JSON.stringify(twin, null, '\t')
    });

    useBreadcrumbEntry({name: 'twin'});

    React.useEffect(() => {
        dispatch(getDeviceTwinAction.started(deviceId));
    },              [deviceId]);

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
        dispatch(getDeviceTwinAction.started(deviceId));
    };

    const handleSave = () => {
        setState({
            ...state,
            isDirty: false,
            isTwinValid: true
        });
        dispatch(updateDeviceTwinAction.started(JSON.parse(state.twin)));
    };

    const renderTwinViewer = () => {
        if (twinState === SynchronizationStatus.working || twinState === SynchronizationStatus.updating) {
            return <MultiLineShimmer className="device-detail"/>;
        }

        return (
            <article className="device-twin device-detail">
                { twin &&
                    <JSONEditor
                        className="json-editor"
                        content={JSON.stringify(twin, null, '\t')}
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
            <HeaderView
                headerText={ResourceKeys.deviceTwin.headerText}
                tooltip={ResourceKeys.deviceTwin.tooltip}
            />
            {renderTwinViewer()}
        </>
    );
};
