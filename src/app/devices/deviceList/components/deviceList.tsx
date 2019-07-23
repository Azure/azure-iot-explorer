/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter, NavLink, Route } from 'react-router-dom';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import GroupedListWrapper from '../../../shared/components/groupedList';
import { DEVICE_LIST_COLUMN_WIDTH, DEVICE_LIST_WIDE_COLUMN_WIDTH } from '../../../constants/devices';
import { CHECK } from '../../../constants/iconNames';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import DeviceQuery from '../../../api/models/deviceQuery';
import DeviceListCommandBar from './deviceListCommandBar';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import { DeviceStatus } from '../../../api/models/deviceStatus';
import BreadcrumbContainer from '../../../shared/components/breadcrumbContainer';
import DeviceListQuery from './deviceListQuery';
import '../../../css/_deviceList.scss';
import '../../../css/_layouts.scss';
import DeviceListCellContainer from './deviceListCellContainer';

export interface DeviceListDataProps {
    connectionString: string;
    devices?: DeviceSummary[];
    deviceListSyncStatus: SynchronizationStatus;
    query?: DeviceQuery;
}

export interface DeviceListDispatchProps {
    listDevices: (query?: DeviceQuery) => void;
    deleteDevices: (deviceIds: string[]) => void;
}

interface DeviceListState {
    selectedDeviceIds: string[];
    showDeleteConfirmation?: boolean;
    query: DeviceQuery;
}

class DeviceListComponent extends React.Component<DeviceListDataProps & DeviceListDispatchProps & RouteComponentProps, DeviceListState> {
    constructor(props: DeviceListDataProps & DeviceListDispatchProps & RouteComponentProps) {
        super(props);

        this.state = {
            query: props.query || { clauses: [], deviceId: '' },
            selectedDeviceIds: [],
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
                                query={this.state.query}
                                setQuery={this.setQuery}
                            />
                            {this.showDeviceList(context)}
                            {this.deleteConfirmationDialog(context)}
                        </div>
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    public shouldComponentUpdate(nextProps: DeviceListDataProps & DeviceListDispatchProps & RouteComponentProps, nextState: DeviceListState): boolean {
        return JSON.stringify(this.props.devices) !== JSON.stringify(nextProps.devices) || this.state !== nextState;
    }

    private readonly setQuery = (query: DeviceQuery) => {
        this.setState(
            {
                query
            },
            () => {
                this.props.listDevices(query);
            });
    }

    public componentDidMount() {
        this.props.listDevices(this.props.query);
    }

    private readonly showCommandBar = () => {
        return (
            <DeviceListCommandBar
                disableAdd={this.props.deviceListSyncStatus === SynchronizationStatus.working}
                disableRefresh={this.props.deviceListSyncStatus === SynchronizationStatus.working}
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
                    deviceId: '',
                    nextLink: ''
                }
            },
            () => {
                this.props.listDevices(this.props.query);
            });
    }

    private readonly showDeviceList = (context: LocalizationContextInterface) => {

        const renderCell = (nestingDepth: number, item: DeviceSummary, itemIndex: number) => {
            return (
                <DeviceListCellContainer
                    deviceId={item.deviceId}
                    itemIndex={itemIndex}
                />
            );
        };

        return (
            <GroupedListWrapper
                items={this.props.devices}
                nameKey="deviceId"
                isLoading={this.props.deviceListSyncStatus === SynchronizationStatus.working}
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
        );
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

    private readonly getColumns = (): IColumn[] => {
        return [
            this.getColumnProps('deviceId', this.onDeviceIdColumnRender),
            this.getColumnProps('isEdgeDevice', this.onIsEdgeDeviceColumnRender),
            this.getColumnProps('isPnpDevice', this.onIsPnpDeviceColumnRender),
            this.getColumnProps('status', this.onStatusColumnRender),
            this.getColumnProps('lastActivityTime', this.onLastActivityColumnRender, DEVICE_LIST_WIDE_COLUMN_WIDTH),
            this.getColumnProps('statusUpdatedTime', this.onStatusUpdatedTimeColumnRender, DEVICE_LIST_WIDE_COLUMN_WIDTH),
            this.getColumnProps('cloudToDeviceMessageCount', this.onC2DMessageCountColumnRender),
            this.getColumnProps('authenticationType', this.onAuthTypeColumnRender)
        ];
    }

    private readonly onRowSelection = (devices: DeviceSummary[]) => {
        this.setState({ selectedDeviceIds: devices.map(device => device.deviceId) });
    }

    private readonly getColumnProps = (key: string, onRender: any, columnWidth?: number): IColumn => { // tslint:disable-line:no-any
        return {
            isResizable: true,
            key,
            maxWidth: columnWidth || DEVICE_LIST_COLUMN_WIDTH,
            minWidth: 50,
            name: (ResourceKeys.deviceLists.columns as any)[key], // tslint:disable-line:no-any
            onRender
        };
    }

    private readonly onDeviceIdColumnRender = (item: DeviceSummary) => {
        const path = this.props.location.pathname.replace(/\/devices\/.*/, '/devices');
        return (
            <NavLink to={`${path}/detail/identity/?id=${encodeURIComponent(item.deviceId)}`}>
                {item.deviceId}
            </NavLink>
        );
    }

    private readonly onIsEdgeDeviceColumnRender = (item: DeviceSummary) => {
        return item.isEdgeDevice && <Icon iconName={CHECK} />;
    }

    private readonly onIsPnpDeviceColumnRender = (item: DeviceSummary) => {
        return item.isPnpDevice && <Icon iconName={CHECK} />;
    }

    private readonly onStatusColumnRender = (item: DeviceSummary) => {
        let status: string;
        switch (item.status && item.status.toLowerCase()) {
            case DeviceStatus.Enabled.toLowerCase():
                status = ResourceKeys.deviceIdentity.hubConnectivity.enabled;
                break;
            case DeviceStatus.Disabled.toLowerCase():
                status = ResourceKeys.deviceIdentity.hubConnectivity.disabled;
                break;
            default:
                status = undefined;
                break;
        }

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <span >{status && context.t(status)}</span>
                )}
            </LocalizationContextConsumer>);
    }

    private readonly onLastActivityColumnRender = (item: DeviceSummary) => {
        return <span>{item.lastActivityTime}</span>;
    }

    private readonly onStatusUpdatedTimeColumnRender = (item: DeviceSummary) => {
        return <span>{item.statusUpdatedTime}</span>;
    }

    private readonly onC2DMessageCountColumnRender = (item: DeviceSummary) => {
        return <span >{item.cloudToDeviceMessageCount}</span>;
    }

    private readonly onAuthTypeColumnRender = (item: DeviceSummary) => {
        let authentication: string;
        switch (item.authenticationType && item.authenticationType.toLowerCase()) {
            case DeviceAuthenticationType.CACertificate.toLowerCase():
                authentication = ResourceKeys.deviceIdentity.authenticationType.ca.type;
                break;
            case DeviceAuthenticationType.SelfSigned.toLowerCase():
                authentication = ResourceKeys.deviceIdentity.authenticationType.selfSigned.type;
                break;
            case DeviceAuthenticationType.SymmetricKey.toLowerCase():
                authentication = ResourceKeys.deviceIdentity.authenticationType.symmetricKey.type;
                break;
            default:
                authentication = undefined;
                break;
        }

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <span >{authentication && context.t(authentication)}</span>
                )}
            </LocalizationContextConsumer>);
    }
}

export default withRouter(DeviceListComponent);
