/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DetailsList, DetailsListLayoutMode, IColumn, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { useLocalizationContext } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import DeviceQuery from '../../../api/models/deviceQuery';
import { DeviceListCommandBar } from './deviceListCommandBar';
import { DeviceListQuery } from './deviceListQuery';
import { ListPaging } from './listPaging';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { CHECK } from '../../../constants/iconNames';
import MultiLineShimmer from '../../../shared/components/multiLineShimmer';
import { LARGE_COLUMN_WIDTH, EXTRA_SMALL_COLUMN_WIDTH, SMALL_COLUMN_WIDTH, MEDIUM_COLUMN_WIDTH } from '../../../constants/columnWidth';
import '../../../css/_deviceList.scss';
import '../../../css/_layouts.scss';

export interface DeviceListDataProps {
    devices?: DeviceSummary[];
    isFetching: boolean;
    query?: DeviceQuery;
}

export interface DeviceListDispatchProps {
    listDevices: (query?: DeviceQuery) => void;
    deleteDevices: (deviceIds: string[]) => void;
}

interface DeviceListState {
    selectedDeviceIds: string[];
    showDeleteConfirmation: boolean;
    refreshQuery: number;
}

const SHIMMER_COUNT = 10;
export const DeviceListComponent: React.FC<DeviceListDataProps & DeviceListDispatchProps> = (props: DeviceListDataProps & DeviceListDispatchProps) => {
    const { t } = useLocalizationContext();
    const { pathname } = useLocation();
    const history = useHistory();

    const { devices, isFetching, query, listDevices, deleteDevices } = props;
    const [ refreshQuery, setRefreshQuery ] = React.useState<number>(0);
    const [ selectedDeviceIds, setSelectedDeviceIds ] = React.useState([]);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = React.useState<boolean>(false);
    const selection = new Selection({
        onSelectionChanged: () => {
            setSelectedDeviceIds(selection.getSelection() && selection.getSelection().map(selectedItem => (selectedItem as DeviceSummary).deviceId));
        }
    });

    React.useEffect(() => {
        listDevices(query);
    },              []);

    const setQueryAndExecute = (deviceQuery: DeviceQuery) => {
        listDevices({
            clauses: deviceQuery.clauses,
            continuationTokens: query.continuationTokens,
            currentPageIndex: 0,
            deviceId: deviceQuery.deviceId
        });
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
        listDevices({
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: ''
        });
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
                continuationTokens={query && query.continuationTokens}
                currentPageIndex={query && query.currentPageIndex}
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
        return listDevices({
            clauses: query.clauses,
            continuationTokens: query.continuationTokens,
            currentPageIndex: pageNumber,
            deviceId: query.deviceId
        });
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
        deleteDevices(selectedDeviceIds);
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
