/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Label } from '@fluentui/react-components';
import { CheckmarkRegular } from '@fluentui/react-icons';
import { IColumn, ResizableDetailsList } from '../../../shared/resizeDetailsList/resizableDetailsList';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import { DeviceQuery } from '../../../api/models/deviceQuery';
import { DeviceListCommandBar } from './deviceListCommandBar';
import { DeviceListQuery } from './deviceListQuery';
import { ListPaging } from './listPaging';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { deviceListReducer } from '../reducer';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { deviceListSaga } from '../saga';
import { deviceListStateInitial } from '../state';
import { listDevicesAction, deleteDevicesAction } from '../actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { AppInsightsClient } from '../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../../../app/constants/telemetry';
import '../../../css/_deviceList.scss';
import { LiveRegion } from '../../../shared/components/liveRegion';

const SHIMMER_COUNT = 10;
export const DeviceList: React.FC = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [ localState, dispatch ] = useAsyncSagaReducer(deviceListReducer, deviceListSaga, deviceListStateInitial(), 'deviceListState');
    const { devices, synchronizationStatus, deviceQuery } = localState;
    const isFetching = React.useMemo(() => synchronizationStatus === SynchronizationStatus.working, [synchronizationStatus]);

    const [ refreshQuery, setRefreshQuery ] = React.useState<number>(0);
    const [ selectedDeviceIds, setSelectedDeviceIds ] = React.useState([]);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = React.useState<boolean>(false);

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.DEVICE_LIST});
    }, []); // tslint:disable-line: align

    React.useEffect(() => {
        setQueryAndExecute(deviceQuery);
    },              []);

    const setQueryAndExecute = (query: DeviceQuery) => {
        dispatch(listDevicesAction.started({
            clauses: query.clauses,
            continuationTokens: query.continuationTokens,
            currentPageIndex: 0,
            deviceId: query.deviceId
        }));
    };

    const showCommandBar = () => {
        return (
            <DeviceListCommandBar
                disableAdd={isFetching}
                disableRefresh={isFetching}
                disableDelete={selectedDeviceIds.length === 0}
                handleAdd={handleAdd}
                handleRefresh={refresh}
                handleDelete={deleteConfirmation}
            />
        );
    };

    const refresh = () => {
        dispatch(listDevicesAction.started({
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: ''
        }));
        setRefreshQuery(refreshQuery + 1);
    };

    const showDeviceList = () => {
        return (
            <>
                {showPaging()}
                <div className="list-detail">
                    {isFetching ?
                        <MultiLineShimmer shimmerCount={SHIMMER_COUNT}/> :
                        (devices && devices.length !== 0 ?
                            <ResizableDetailsList
                                    items={!isFetching && devices}
                                    columns={getColumns()}
                                    onRenderItemColumn={onRenderItemColumn}
                                    onSelectionChange={(selectedIndices) => {
                                        const selected = [...selectedIndices].map(i => devices[i]?.deviceId).filter(Boolean);
                                        setSelectedDeviceIds(selected);
                                    }}
                                    ariaLabelForSelectAllCheckbox={t(ResourceKeys.deviceLists.selectAllCheckboxAriaLabel)}
                                    ariaLabelForSelectionColumn={t(ResourceKeys.deviceLists.toggleSelectionColumnAriaLabel)}
                                    checkButtonAriaLabel={(item: any) => `${t(ResourceKeys.deviceLists.rowCheckBoxAriaLabel)} ${item.deviceId || ''}`}
                                />:
                            <>
                                <span className="no-device">{t(ResourceKeys.deviceLists.noDevice)}</span>
                                <LiveRegion message={t(ResourceKeys.deviceLists.noDevice)}
                                />
                            </>
                        )
                    }
                </div>
            </>
        );
    };

    const showPaging = () => {
        return (
            <ListPaging
                continuationTokens={deviceQuery && deviceQuery.continuationTokens}
                currentPageIndex={deviceQuery && deviceQuery.currentPageIndex}
                fetchPage={fetchPage}
            />
        );
    };

    // tslint:disable-next-line: cyclomatic-complexity
    const onRenderItemColumn = (item: DeviceSummary, index: number, column: IColumn): React.JSX.Element | string => {
        switch (column.key) {
            case 'id':
                const path = pathname.replace(/\/devices\/.*/, `/${ROUTE_PARTS.DEVICES}`);
                return (
                    <NavLink key={column.key} to={`${path}/${ROUTE_PARTS.DEVICE_DETAIL}/${ROUTE_PARTS.IDENTITY}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(item.deviceId)}`}>
                        {item.deviceId}
                    </NavLink>
                );
            case 'status':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.status}
                    </Label>
                );
            case 'connection':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.connectionState}
                    </Label>
                );
            case 'authenticationType':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.authenticationType}
                    </Label>
                );
            case 'statusUpdatedTime':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.statusUpdatedTime || '--'}
                    </Label>
                );
            case 'modelId':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.modelId}
                    </Label>
                );
            case 'edge':
                const isEdge = item.iotEdge;
                return (
                    isEdge ? <CheckmarkRegular key={column.key} /> : <span key={column.key} />
            );
            default:
                return <></>;
        }
    };

    const getColumns = (): IColumn[] => {
        return [
            {
                fieldName: 'id',
                isMultiline: true,
                key: 'id',
                minWidth: 200,
                name: t(ResourceKeys.deviceLists.columns.deviceId.label),
            },
            {
                fieldName: 'status',
                key: 'status',
                minWidth: 100,
                name: t(ResourceKeys.deviceLists.columns.status.label)
            },
            {
                fieldName: 'connection',
                key: 'connection',
                minWidth: 100,
                name: t(ResourceKeys.deviceLists.columns.connection)
            },
            {
                fieldName: 'authenticationType',
                isMultiline: true,
                key: 'authenticationType',
                minWidth: 100,
                name: t(ResourceKeys.deviceLists.columns.authenticationType)
            },
            {
                fieldName: 'statusUpdatedTime',
                isMultiline: true,
                key: 'statusUpdatedTime',
                minWidth: 100,
                name: t(ResourceKeys.deviceLists.columns.statusUpdatedTime),
            },
            {
                fieldName: 'modelId',
                isMultiline: true,
                key: 'modelId',
                minWidth: 120,
                name: t(ResourceKeys.deviceLists.columns.isPnpDevice)
            },
            {
                fieldName: 'edge',
                key: 'edge',
                minWidth: 100,
                name: t(ResourceKeys.deviceLists.columns.isEdgeDevice.label)
            },
        ];
    };

    const fetchPage = (pageNumber: number) => {
        dispatch(listDevicesAction.started({
            clauses: deviceQuery.clauses,
            continuationTokens: deviceQuery.continuationTokens,
            currentPageIndex: pageNumber,
            deviceId: deviceQuery.deviceId
        }));
    };

    const deleteConfirmationDialog = () => {
        return (
            <Dialog
                open={showDeleteConfirmation}
                onOpenChange={(e, data) => { if (!data.open) {closeDeleteDialog();} }}
                modalType="alert"
            >
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.title)}</DialogTitle>
                        <DialogContent>
                            <div>{t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.subText)}</div>
                            <ul className="deleting-devices">
                                {selectedDeviceIds && selectedDeviceIds.map(deviceId =>
                                    <li key={`deleting_${deviceId}`}>{deviceId}</li>
                                )}
                            </ul>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="primary" onClick={handleDelete}>{t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.confirm)}</Button>
                            <Button onClick={closeDeleteDialog}>{t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.cancel)}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        );
    };

    const deleteConfirmation = () => setShowDeleteConfirmation(true);
    const closeDeleteDialog = () => setShowDeleteConfirmation(false);

    const handleAdd = () => {
        const path = pathname.replace(/\/devices\/.*/, `/${ROUTE_PARTS.DEVICES}`);
        navigate(`${path}/${ROUTE_PARTS.ADD}`);
    };

    const handleDelete = () => {
        dispatch(deleteDevicesAction.started(selectedDeviceIds));
        setShowDeleteConfirmation(false);
    };

    return (
        <div>
            {showCommandBar()}
            <DeviceListQuery
                refresh={refreshQuery}
                setQueryAndExecute={setQueryAndExecute}
            />
            {showDeviceList()}
            {showDeleteConfirmation && deleteConfirmationDialog()}
        </div>
    );
};
