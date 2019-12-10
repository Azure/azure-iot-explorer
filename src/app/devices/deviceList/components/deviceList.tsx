/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter, NavLink, Route } from 'react-router-dom';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DetailsList, DetailsListLayoutMode, IColumn, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import DeviceQuery from '../../../api/models/deviceQuery';
import DeviceListCommandBar from './deviceListCommandBar';
import BreadcrumbContainer from '../../../shared/components/breadcrumbContainer';
import DeviceListQuery from './deviceListQuery';
import ListPaging from './listPaging';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { CHECK } from '../../../constants/iconNames';
import MultiLineShimmer from '../../../shared/components/multiLineShimmer';
import { LARGE_COLUMN_WIDTH, EXTRA_SMALL_COLUMN_WIDTH, SMALL_COLUMN_WIDTH, MEDIUM_COLUMN_WIDTH } from '../../../constants/columnWidth';
import '../../../css/_deviceList.scss';
import '../../../css/_layouts.scss';

export interface DeviceListDataProps {
    connectionString: string;
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
class DeviceListComponent extends React.Component<DeviceListDataProps & DeviceListDispatchProps & RouteComponentProps, DeviceListState> {
    constructor(props: DeviceListDataProps & DeviceListDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            refreshQuery: 0,
            selectedDeviceIds: [],
            showDeleteConfirmation: false
        };

        this.selection = new Selection({
            onSelectionChanged: () => {
                this.setState({
                    selectedDeviceIds: this.selection.getSelection() && this.selection.getSelection().map(selection => (selection as DeviceSummary).deviceId)
                });
            }
          });
    }

    private selection: Selection;

    public render() {
        if (!this.props.connectionString) {
            return (<Redirect to="/" />);
        }

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="view">
                        <div className="view-header">
                            <Route component={BreadcrumbContainer} />
                        </div>
                        <div className="view-command">
                            {this.showCommandBar()}
                        </div>
                        <div className="view-content view-scroll-vertical">
                            <DeviceListQuery
                                refresh={this.state.refreshQuery}
                                setQueryAndExecute={this.setQueryAndExecute}
                            />
                            {this.showDeviceList(context)}
                            {this.state.showDeleteConfirmation && this.deleteConfirmationDialog(context)}
                        </div>
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly setQueryAndExecute = (query: DeviceQuery) => {
        this.props.listDevices({
            clauses: query.clauses,
            continuationTokens: query.continuationTokens,
            currentPageIndex: 0,
            deviceId: query.deviceId
        });
    }

    public componentDidMount() {
        this.props.listDevices(this.props.query);
    }

    private readonly showCommandBar = () => {
        return (
            <DeviceListCommandBar
                disableAdd={this.props.isFetching}
                disableRefresh={this.props.isFetching}
                disableDelete={this.state.selectedDeviceIds.length === 0}
                handleAdd={this.handleAdd}
                handleRefresh={this.refresh}
                handleDelete={this.deleteConfirmation}
            />
        );
    }

    private readonly refresh = () => {
        this.props.listDevices({
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: ''
        });
        this.setState({refreshQuery: this.state.refreshQuery + 1});
    }

    private readonly showDeviceList = (context: LocalizationContextInterface) => {
        return (
            <>
                {this.showPaging()}
                <div className="list-detail">
                    {this.props.isFetching ?
                        <MultiLineShimmer shimmerCount={SHIMMER_COUNT}/> :
                        (this.props.devices && this.props.devices.length !== 0 ?
                            <MarqueeSelection selection={this.selection}>
                                <DetailsList
                                    onRenderItemColumn={this.renderItemColumn(context)}
                                    items={!this.props.isFetching && this.props.devices}
                                    columns={this.getColumns(context)}
                                    layoutMode={DetailsListLayoutMode.justified}
                                    selection={this.selection}
                                />
                            </MarqueeSelection> :
                            <>
                                <h3>{context.t(ResourceKeys.deviceLists.noDevice)}</h3>
                                <Announced
                                    message={context.t(ResourceKeys.deviceLists.noDevice)}
                                />
                            </>
                        )
                    }
                </div>
            </>
        );
        // todo announce no result
    }

    private readonly showPaging = () => {
        return (
            <ListPaging
                continuationTokens={this.props.query && this.props.query.continuationTokens}
                currentPageIndex={this.props.query && this.props.query.currentPageIndex}
                fetchPage={this.fetchPage}
            />
        );
    }

    private readonly getColumns = (context: LocalizationContextInterface): IColumn[] => {
        return [
            { fieldName: 'id', isMultiline: true, isResizable: true, key: 'id',
                maxWidth: LARGE_COLUMN_WIDTH, minWidth: 100, name: context.t(ResourceKeys.deviceLists.columns.deviceId.label) },
            { fieldName: 'status', isResizable: true, key: 'status',
                maxWidth: EXTRA_SMALL_COLUMN_WIDTH, minWidth: 100, name: context.t(ResourceKeys.deviceLists.columns.status.label)},
            { fieldName: 'connection', isResizable: true, key: 'connection',
                maxWidth: SMALL_COLUMN_WIDTH, minWidth: 100, name: context.t(ResourceKeys.deviceLists.columns.connection) },
            { fieldName: 'authenticationType',  isMultiline: true, isResizable: true, key: 'authenticationType',
                maxWidth: SMALL_COLUMN_WIDTH,  minWidth: 100, name: context.t(ResourceKeys.deviceLists.columns.authenticationType)},
            { fieldName: 'lastActivityTime', isMultiline: true, isResizable: true, key: 'lastActivityTime',
                maxWidth: MEDIUM_COLUMN_WIDTH, minWidth: 100, name: context.t(ResourceKeys.deviceLists.columns.lastActivityTime)},
            { fieldName: 'statusUpdatedTime', isMultiline: true, isResizable: true, key: 'statusUpdatedTime',
                maxWidth: MEDIUM_COLUMN_WIDTH, minWidth: 100, name: context.t(ResourceKeys.deviceLists.columns.statusUpdatedTime)},
            {  fieldName: 'edge', isResizable: true, key: 'edge',
                minWidth: 100, name: context.t(ResourceKeys.deviceLists.columns.isEdgeDevice.label)},
        ];
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly renderItemColumn = (context: LocalizationContextInterface) => (item: DeviceSummary, index: number, column: IColumn) => {
        switch (column.key) {
            case 'id':
                const path = this.props.location.pathname.replace(/\/devices\/.*/, `/${ROUTE_PARTS.DEVICES}`);
                return (
                    <NavLink key={column.key} to={`${path}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.IDENTITY}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(item.deviceId)}`}>
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
            case 'lastActivityTime':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.lastActivityTime || '--'}
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
                            context.t(ResourceKeys.deviceLists.columns.isEdgeDevice.yes) : context.t(ResourceKeys.deviceLists.columns.isEdgeDevice.no)}
                    />
                );
            default:
                return;
        }
    }

    private readonly fetchPage = (pageNumber: number) => {
        const { query } = this.props;
        return this.props.listDevices({
            clauses: query.clauses,
            continuationTokens: query.continuationTokens,
            currentPageIndex: pageNumber,
            deviceId: query.deviceId
        });
    }

    private readonly deleteConfirmationDialog = (context: LocalizationContextInterface) => {
        return (
            <div role="dialog">
                <Dialog
                    className="delete-dialog"
                    hidden={!this.state.showDeleteConfirmation}
                    onDismiss={this.closeDeleteDialog}
                    dialogContentProps={{
                        subText: context.t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.subText),
                        title: context.t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.title),
                        type: DialogType.close,
                    }}
                    modalProps={{
                        isBlocking: true,
                    }}
                >
                    <ul className="deleting-devices">
                        {this.state.selectedDeviceIds && this.state.selectedDeviceIds.map(deviceId =>
                            <li key={`deleting_${deviceId}`}>{deviceId}</li>
                        )}
                    </ul>
                    <DialogFooter>
                        <PrimaryButton onClick={this.handleDelete} text={context.t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.confirm)} />
                        <DefaultButton onClick={this.closeDeleteDialog} text={context.t(ResourceKeys.deviceLists.commands.delete.confirmationDialog.cancel)} />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }

    private readonly deleteConfirmation = () => {
        this.setState({
            showDeleteConfirmation: true
        });
    }

    private readonly closeDeleteDialog = () => {
        this.setState({
            showDeleteConfirmation: false
        });
    }

    private readonly handleAdd = () => {
        const path = this.props.location.pathname.replace(/\/devices\/.*/, `/${ROUTE_PARTS.DEVICES}`);
        this.props.history.push(`${path}/${ROUTE_PARTS.ADD}`);
    }

    private readonly handleDelete = () => {
        this.props.deleteDevices(this.state.selectedDeviceIds);
        this.setState({
            showDeleteConfirmation: false
        });
    }
}

export default withRouter(DeviceListComponent);
