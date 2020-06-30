/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/components/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import { DetailsList, DetailsListLayoutMode, IColumn, Selection } from 'office-ui-fabric-react/lib/components/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/components/MarqueeSelection/MarqueeSelection';
import { Announced } from 'office-ui-fabric-react/lib/components/Announced';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import { DeviceQuery } from '../../../api/models/deviceQuery';
import { DeviceListCommandBar } from './deviceListCommandBar';
import { DeviceListQuery } from './deviceListQuery';
import { ListPaging } from './listPaging';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { CHECK } from '../../../constants/iconNames';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { deviceListReducer } from '../reducer';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { deviceListSaga } from '../saga';
import { deviceListStateInitial } from '../state';
import { listDevicesAction, deleteDevicesAction } from '../actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { LARGE_COLUMN_WIDTH, EXTRA_SMALL_COLUMN_WIDTH, SMALL_COLUMN_WIDTH, MEDIUM_COLUMN_WIDTH } from '../../../constants/columnWidth';
import '../../../css/_deviceList.scss';
import '../../../css/_layouts.scss';

const SHIMMER_COUNT = 10;
export const DeviceList: React.FC = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const history = useHistory();

    const [ localState, dispatch ] = useAsyncSagaReducer(deviceListReducer, deviceListSaga, deviceListStateInitial(), 'deviceListState');
    const { devices, synchronizationStatus, deviceQuery } = localState;
    const isFetching = React.useMemo(() => synchronizationStatus === SynchronizationStatus.working, [synchronizationStatus]);

    const [ refreshQuery, setRefreshQuery ] = React.useState<number>(0);
    const [ selectedDeviceIds, setSelectedDeviceIds ] = React.useState([]);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = React.useState<boolean>(false);
    const selection = new Selection({
        onSelectionChanged: () => {
            setSelectedDeviceIds(selection.getSelection() && selection.getSelection().map(selectedItem => (selectedItem as DeviceSummary).deviceId));
        }
    });

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
                            <MarqueeSelection selection={selection}>
                                <DetailsList
                                    onRenderItemColumn={renderItemColumn()}
                                    items={!isFetching && devices}
                                    columns={getColumns()}
                                    layoutMode={DetailsListLayoutMode.justified}
                                    selection={selection}
                                />
                            </MarqueeSelection> :
                            <>
                                <h3>{t(ResourceKeys.deviceLists.noDevice)}</h3>
                                <Announced
                                    message={t(ResourceKeys.deviceLists.noDevice)}
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

    const getColumns = (): IColumn[] => {
        return [
            { fieldName: 'id', isMultiline: true, isResizable: true, key: 'id',
                maxWidth: LARGE_COLUMN_WIDTH, minWidth: 100, name: t(ResourceKeys.deviceLists.columns.deviceId.label) },
            { fieldName: 'status', isResizable: true, key: 'status',
                maxWidth: EXTRA_SMALL_COLUMN_WIDTH, minWidth: 100, name: t(ResourceKeys.deviceLists.columns.status.label)},
            { fieldName: 'connection', isResizable: true, key: 'connection',
                maxWidth: SMALL_COLUMN_WIDTH, minWidth: 100, name: t(ResourceKeys.deviceLists.columns.connection) },
            { fieldName: 'authenticationType',  isMultiline: true, isResizable: true, key: 'authenticationType',
                maxWidth: SMALL_COLUMN_WIDTH,  minWidth: 100, name: t(ResourceKeys.deviceLists.columns.authenticationType)},
            { fieldName: 'statusUpdatedTime', isMultiline: true, isResizable: true, key: 'statusUpdatedTime',
                maxWidth: MEDIUM_COLUMN_WIDTH, minWidth: 100, name: t(ResourceKeys.deviceLists.columns.statusUpdatedTime)},
            {  fieldName: 'edge', isResizable: true, key: 'edge',
                minWidth: 100, name: t(ResourceKeys.deviceLists.columns.isEdgeDevice.label)},
        ];
    };

    // tslint:disable-next-line:cyclomatic-complexity
    const renderItemColumn = () => (item: DeviceSummary, index: number, column: IColumn) => {
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
            case 'edge':
                const isEdge = item.iotEdge;
                return (
                    <Icon
                        key={column.key}
                        iconName={isEdge && CHECK}
                        ariaLabel={isEdge ?
                            t(ResourceKeys.deviceLists.columns.isEdgeDevice.yes) : t(ResourceKeys.deviceLists.columns.isEdgeDevice.no)}
                    />
                );
            default:
                return;
        }
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
            <div role="dialog">
                <Dialog
                    className="delete-dialog"
                    hidden={!showDeleteConfirmation}
                    onDismiss={closeDeleteDialog}
                    dialogContentProps={{
                        subText: t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.subText),
                        title: t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.title),
                        type: DialogType.close,
                    }}
                    modalProps={{
                        isBlocking: true,
                    }}
                >
                    <ul className="deleting-devices">
                        {selectedDeviceIds && selectedDeviceIds.map(deviceId =>
                            <li key={`deleting_${deviceId}`}>{deviceId}</li>
                        )}
                    </ul>
                    <DialogFooter>
                        <PrimaryButton onClick={handleDelete} text={t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.confirm)} />
                        <DefaultButton onClick={closeDeleteDialog} text={t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.cancel)} />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    };

    const deleteConfirmation = () => setShowDeleteConfirmation(true);
    const closeDeleteDialog = () => setShowDeleteConfirmation(false);

    const handleAdd = () => {
        const path = pathname.replace(/\/devices\/.*/, `/${ROUTE_PARTS.DEVICES}`);
        history.push(`${path}/${ROUTE_PARTS.ADD}`);
    };

    const handleDelete = () => {
        dispatch(deleteDevicesAction.started(selectedDeviceIds));
        setShowDeleteConfirmation(false);
        // clear selection
        selection.setItems([]);
    };

    return (
        <div className="view">
            <div className="view-command">
                {showCommandBar()}
            </div>
            <div className="view-content view-scroll-vertical">
                <DeviceListQuery
                    refresh={refreshQuery}
                    setQueryAndExecute={setQueryAndExecute}
                />
                {showDeviceList()}
                {showDeleteConfirmation && deleteConfirmationDialog()}
            </div>
        </div>
    );
};
