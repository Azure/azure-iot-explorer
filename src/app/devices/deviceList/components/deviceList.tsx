/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter, NavLink, Route } from 'react-router-dom';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import GroupedListWrapper from '../../../shared/components/groupedList';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import DeviceQuery from '../../../api/models/deviceQuery';
import DeviceListCommandBar from './deviceListCommandBar';
import BreadcrumbContainer from '../../../shared/components/breadcrumbContainer';
import DeviceListQuery from './deviceListQuery';
import { DeviceListCell } from './deviceListCell';
import ListPagingFooter from './listPagingFooter';
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
    query: DeviceQuery;
}

class DeviceListComponent extends React.Component<DeviceListDataProps & DeviceListDispatchProps & RouteComponentProps, DeviceListState> {
    constructor(props: DeviceListDataProps & DeviceListDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            query: props.query || { clauses: [], continuationTokens: [], currentPageIndex: 0, deviceId: '' },
            selectedDeviceIds: [],
            showDeleteConfirmation: false
        };
    }

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
                        <div className="view-content view-scroll">
                            <DeviceListQuery
                                executeQuery={this.executeQuery}
                                query={this.state.query}
                                setQuery={this.setQuery}
                            />
                            {this.showDeviceList(context)}
                            {this.state.showDeleteConfirmation && this.deleteConfirmationDialog(context)}
                        </div>
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly executeQuery = () => {
        this.props.listDevices(this.state.query);
    }

    private readonly setQuery = (query: DeviceQuery) => {
        this.setState({
            query
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
        this.setState(
            {
                query: {
                    clauses: [],
                    continuationTokens: [],
                    currentPageIndex: 0,
                    deviceId: '',
                }
            },
            () => {
                this.props.listDevices(this.props.query);
            });
    }

    private readonly showDeviceList = (context: LocalizationContextInterface) => {

        const renderCell = (nestingDepth: number, item: DeviceSummary, itemIndex: number) => {
            return (
                <DeviceListCell
                    connectionString={this.props.connectionString}
                    device={item}
                    itemIndex={itemIndex}
                />
            );
        };
        debugger; //tslint:disable-line

        return (
            <>
            <GroupedListWrapper
                items={this.props.devices}
                nameKey="deviceId"
                isLoading={this.props.isFetching}
                noItemsMessage={context.t(ResourceKeys.deviceLists.noDevice)}
                onRenderCell={renderCell}
                onSelectionChanged={this.onRowSelection}
                columnInfo={[
                    {
                        infoText: context.t(ResourceKeys.deviceLists.columns.deviceId.infoText),
                        name: context.t(ResourceKeys.deviceLists.columns.deviceId.label),
                        onRenderColumn: (group, key) => {
                            const path = this.props.location.pathname.replace(/\/devices\/.*/, '/devices');
                            return (
                                <NavLink key={key} className={'deviceId-label'} to={`${path}/detail/identity/?id=${encodeURIComponent(group.name)}`}>
                                    {group.name}
                                </NavLink>
                            );
                        },
                        widthPercentage: 30
                    },
                    {
                        infoText: context.t(ResourceKeys.deviceLists.columns.status.infoText),
                        name: context.t(ResourceKeys.deviceLists.columns.status.label),
                        onRenderColumn: (group, key) => {
                            return (
                                <Label
                                    key={key}
                                    className={'status-label'}
                                >
                                    {(group.data as DeviceSummary).status}
                                </Label>
                            );
                        },
                        widthPercentage: 20
                    }
                ]}
            />
            <ListPagingFooter
                continuationTokens={this.props.query && this.props.query.continuationTokens}
                currentPageIndex={this.props.query && this.props.query.currentPageIndex}
                fetchPage={this.fetchPage}
            />
            </>
        );
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
        const path = this.props.location.pathname.replace(/\/devices\/.*/, '/devices');
        this.props.history.push(`${path}/add`);
    }

    private readonly handleDelete = () => {
        this.props.deleteDevices(this.state.selectedDeviceIds);
        this.setState({
            showDeleteConfirmation: false
        });
    }

    private readonly onRowSelection = (devices: DeviceSummary[]) => {
        this.setState({ selectedDeviceIds: devices.map(device => device.deviceId) });
    }
}

export default withRouter(DeviceListComponent);
