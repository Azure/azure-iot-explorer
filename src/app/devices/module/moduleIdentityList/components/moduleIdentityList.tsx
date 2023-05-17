/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { IColumn, SelectionMode, CommandBar, Label } from '@fluentui/react';
import { ResizableDetailsList } from '../../../../shared/resizeDetailsList/resizableDetailsList';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, ArrayOperation } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { ModuleIdentity } from '../../../../api/models/moduleIdentity';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { HeaderView } from '../../../../shared/components/headerView';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { moduleIndentityListStateInitial } from '../state';
import { getModuleIdentitiesSaga } from '../saga';
import { moduleIdentityListReducer } from '../reducer';
import { getModuleIdentitiesAction } from '../actions';
import { AppInsightsClient } from '../../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../../../../app/constants/telemetry';
import '../../../../css/_deviceDetail.scss';

export const ModuleIdentityList: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const { url } = useRouteMatch();
    const history = useHistory();
    const deviceId = getDeviceIdFromQueryString(search);

    const [ localState, dispatch ] = useAsyncSagaReducer(moduleIdentityListReducer, getModuleIdentitiesSaga, moduleIndentityListStateInitial(), 'moduleIdentityListState');
    const moduleIdentityList = localState.payload;
    const synchronizationStatus = localState.synchronizationStatus;

    React.useEffect(() => {
        dispatch(getModuleIdentitiesAction.started(deviceId));
    },              [deviceId]);

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.MODULE_LIST});
    }, []); // tslint:disable-line: align

    const showCommandBar = () => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.command.add),
                        iconProps: {iconName: ArrayOperation.ADD},
                        key: ArrayOperation.ADD,
                        name: t(ResourceKeys.moduleIdentity.command.add),
                        onClick: handleAdd
                    },
                    {
                        ariaLabel: t(ResourceKeys.moduleIdentity.command.refresh),
                        disabled: synchronizationStatus === SynchronizationStatus.working,
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: t(ResourceKeys.moduleIdentity.command.refresh),
                        onClick: handleRefresh
                    }
                ]}
            />
        );
    };

    const handleAdd = () => {
        const path = pathname.concat(ROUTE_PARTS.ADD);
        history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    };

    const handleRefresh = () => {
        dispatch(getModuleIdentitiesAction.started(deviceId));
    };

    const renderGrid = () => {
        return (
            <div className="device-detail">
                 <div className="list-detail">
                    <ResizableDetailsList
                        columns={getColumns()}
                        items={moduleIdentityList}
                        selectionMode={SelectionMode.none}
                        onRenderItemColumn={renderItemColumn}
                    />
                </div>

                {synchronizationStatus === SynchronizationStatus.working && <MultiLineShimmer/>}
                {synchronizationStatus === SynchronizationStatus.fetched && moduleIdentityList.length === 0 && t(ResourceKeys.moduleIdentity.noModules)}
                {synchronizationStatus === SynchronizationStatus.failed && t(ResourceKeys.moduleIdentity.errorFetching)}
            </div>
        );
    };

    const getModuleDetailPageUrl = (item: ModuleIdentity) => {
        return `${url.endsWith('/') ? url : url + '/'}${ROUTE_PARTS.MODULE_DETAIL}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.MODULE_ID}=${item.moduleId}`;
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const renderItemColumn = (item: ModuleIdentity, index: number, column: IColumn) => {
        switch (column.key) {
            case 'moduleId':
                return (
                <NavLink
                    key={column.key}
                    to={getModuleDetailPageUrl(item)}
                >
                    {item.moduleId}
                </NavLink>
                );
            case 'connectionState':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.connectionState}
                    </Label>
                );
            case 'connectionStateLastUpdated':
                return (
                    <Label
                        key={column.key}
                    >
                        {parseDateTimeString(item.connectionStateUpdatedTime) || '--'}
                    </Label>
                );
            case 'lastActivityTime':
                return (
                    <Label
                        key={column.key}
                    >
                        {parseDateTimeString(item.lastActivityTime) || '--'}
                    </Label>
                );
            case 'modelId':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.modelId || '--'}
                    </Label>
                );
            default:
                return <></>;
        }
    };

    const getColumns = (): IColumn[] => {
        const columns: IColumn[] = [
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.moduleId),
                fieldName: 'moduleId',
                key: 'moduleId',
                maxWidth: 200,
                minWidth: 50,
                name: t(ResourceKeys.moduleIdentity.columns.moduleId),
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.connectionState),
                fieldName: 'connectionState',
                key: 'connectionState',
                maxWidth: 200,
                minWidth: 50,
                name: t(ResourceKeys.moduleIdentity.columns.connectionState)
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.connectionStateLastUpdated),
                fieldName: 'connectionStateLastUpdated',
                key: 'connectionStateLastUpdated',
                maxWidth: 250,
                minWidth: 150,
                name: t(ResourceKeys.moduleIdentity.columns.connectionStateLastUpdated)
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.lastActivityTime),
                fieldName: 'lastActivityTime',
                key: 'lastActivityTime',
                maxWidth: 250,
                minWidth: 150,
                name: t(ResourceKeys.moduleIdentity.columns.lastActivityTime)
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.modelId),
                fieldName: 'modelId',
                key: 'modelId',
                maxWidth: 250,
                minWidth: 150,
                name: t(ResourceKeys.moduleIdentity.columns.modelId)
            }];

        return columns;
    };

    return (
        <>
            {showCommandBar()}
            <HeaderView
                headerText={ResourceKeys.moduleIdentity.headerText}
                link={ResourceKeys.moduleIdentity.link}
                tooltip={ResourceKeys.moduleIdentity.tooltip}
            />
            {renderGrid()}
        </>
    );
};
