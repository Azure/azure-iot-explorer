import * as React from 'react';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import '../../../css/_deviceListCell.scss';

export interface DeviceListCellProps {
    itemIndex: number | string;
    device: DeviceSummary;
    deviceId: string;
    isLoading: boolean;
    interfaceIds: string[];
    fetchDeviceInfo: (deviceId: string) => void;
}

export class DeviceListCell extends React.PureComponent<DeviceListCellProps> {

    constructor(props: DeviceListCellProps) {
        super(props);
    }

    public render() {
        const { itemIndex, isLoading, device } = this.props;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    !isLoading ?
                        <div className="device-list-cell-container" data-selection-index={itemIndex}>
                            {this.renderCellDeviceInfo(device, context)}
                            {this.renderCellInterfaceInfo(device, context)}
                        </div>
                    :
                        <div className="device-list-cell-container" data-selection-index={itemIndex}>
                            {this.renderLoadingInfo(context)}
                        </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentWillMount() {
        const { fetchDeviceInfo, device } = this.props;
        fetchDeviceInfo(device.deviceId);
    }

    private readonly renderCellDeviceInfo = (device: DeviceSummary, context: LocalizationContextInterface) => {
        return (
            <div className="device-list-cell-container-content">
                <span className="device-list-cell-item first">{`${context.t(ResourceKeys.deviceLists.columns.lastActivityTime)}: `}<span className="data">{device.lastActivityTime || context.t(ResourceKeys.deviceLists.noData)}</span></span>
                <span className={`device-list-cell-item ${!device.isPnpDevice && 'last'}`}>{`${context.t(ResourceKeys.deviceLists.columns.statusUpdatedTime)}: `}<span className="data">{device.statusUpdatedTime || context.t(ResourceKeys.deviceLists.noData)}</span></span>
                {!!device.isPnpDevice && <span className="device-list-cell-item last"><img className="pnp-icon" src="../../../icon/pnp.png" alt="PNP Icon" /> {context.t(ResourceKeys.deviceLists.columns.isPnpDevice)}</span>}
            </div>
        );
    }

    private readonly renderCellInterfaceInfo = (device: DeviceSummary, context: LocalizationContextInterface) => {
        const listInterfaces = (deviceSummary: DeviceSummary) => {
            return deviceSummary.interfaceIds && deviceSummary.interfaceIds.length > 0 ? deviceSummary.interfaceIds.join('; ') : '';
        };

        return (
            <div className="device-list-cell-container-content">
                {!!device.isPnpDevice && <span className="device-list-cell-item first no-border">{`${context.t(ResourceKeys.deviceLists.columns.interfaces)}: `}<span className="data">{device.interfaceIds && device.interfaceIds.length > 0 ? listInterfaces(device) : context.t(ResourceKeys.deviceLists.noData)}</span></span>}
            </div>
        );
    }

    private readonly renderLoadingInfo = (context: LocalizationContextInterface) => {
        return (
            <div className="device-list-cell-container-content">
                <span className="device-list-cell-item first">{`${context.t(ResourceKeys.common.loading)}: `}</span>
            </div>
        );
    }

}
