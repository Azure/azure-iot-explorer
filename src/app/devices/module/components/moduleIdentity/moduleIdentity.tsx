/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { DetailsList, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, ArrayOperation } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { ModuleIdentity } from '../../../../api/models/moduleIdentity';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { HeaderView } from '../../../../shared/components/headerView';
import '../../../../css/_deviceDetail.scss';

export interface ModuleIdentityDataProps {
    moduleIdentityList: ModuleIdentity[];
    synchronizationStatus: SynchronizationStatus;
}

export interface ModuleIdentityDispatchProps {
    getModuleIdentities: (deviceId: string) => void;
}

export const ModuleIdentityComponent: React.FC<ModuleIdentityDataProps & ModuleIdentityDispatchProps> = (props: ModuleIdentityDataProps & ModuleIdentityDispatchProps) => {
    const { t } = useLocalizationContext();
    const { search, pathname } = useLocation();
    const { url } = useRouteMatch();
    const history = useHistory();

    const { getModuleIdentities, synchronizationStatus, moduleIdentityList } = props;
    const deviceId = getDeviceIdFromQueryString(search);

    React.useEffect(() => {
        getModuleIdentities(deviceId);
    },              []);

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
        getModuleIdentities(deviceId);
    };

    const renderGrid = () => {
        return (
            <div className="device-detail">
                 <div className="list-detail">
                    <DetailsList
                        columns={getColumns()}
                        items={moduleIdentityList}
                        selectionMode={SelectionMode.none}
                    />
                </div>

                {synchronizationStatus === SynchronizationStatus.working && <MultiLineShimmer/>}
                {synchronizationStatus === SynchronizationStatus.fetched && moduleIdentityList.length === 0 && t(ResourceKeys.moduleIdentity.noModules)}
                {synchronizationStatus === SynchronizationStatus.failed && t(ResourceKeys.moduleIdentity.errorFetching)}
            </div>
        );
    };

    const getColumns = (): IColumn[] => {
        const columns: IColumn[] = [
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.moduleId),
                fieldName: 'moduleId',
                isResizable: true,
                key: 'moduleId',
                maxWidth: 200,
                minWidth: 50,
                name: t(ResourceKeys.moduleIdentity.columns.moduleId),
                onRender: item => (
                <NavLink
                    key={item.key}
                    to={`${url}${ROUTE_PARTS.MODULE_DETAIL}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.MODULE_ID}=${item.moduleId}`}
                >
                    {item.moduleId}
                </NavLink>
                )
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.connectionState),
                fieldName: 'connectionState',
                isResizable: true,
                key: 'connectionState',
                maxWidth: 200,
                minWidth: 50,
                name: t(ResourceKeys.moduleIdentity.columns.connectionState)
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.connectionStateLastUpdated),
                fieldName: 'connectionStateLastUpdated',
                isResizable: true,
                key: 'connectionStateLastUpdated',
                maxWidth: 250,
                minWidth: 150,
                name: t(ResourceKeys.moduleIdentity.columns.connectionStateLastUpdated),
                onRender: item => parseDateTimeString(item.connectionStateUpdatedTime) || '--'
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.lastActivityTime),
                fieldName: 'lastActivityTime',
                key: 'lastActivityTime',
                maxWidth: 250,
                minWidth: 150,
                name: t(ResourceKeys.moduleIdentity.columns.lastActivityTime),
                onRender: item => parseDateTimeString(item.lastActivityTime) || '--'
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
