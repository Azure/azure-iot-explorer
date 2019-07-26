import * as React from 'react';
import { Icon, registerIcons } from 'office-ui-fabric-react';
import { DeviceSummary } from '../../../api/models/deviceSummary';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import '../../../css/_deviceListCell.scss';

// tslint:disable
registerIcons({
    icons: {
      'pnp-svg': (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64">
        <path fill="#2F76BC" d="M58.7,9.9L58.7,9.9c-0.4,0-0.8,0-0.8,0.4L50.2,20c-2.8-6.9-9.3-11.7-17.4-11.3c-8.1,0-15,4.9-17.8,12.2
            C6.9,21.6,0,27.7,0,37.4S8.5,54,17.8,54h31.6C57.5,54,64,47.1,64,39.8c0-6.1-4.1-11.3-9.7-13l9.3-12.2c0,0,0.4-0.4,0-0.8l0,0V9.9
            L58.7,9.9z"/>
        <path fill="#75D0EB" d="M17.8,32.9l-1.2-1.6c-0.4-0.4-0.4-1.2,0-1.6l4.1-3.6c0.4,0,0.4-0.4,0.8-0.4c0.4,0,0.4,0,0.8,0.4l10.9,11.7
            l24.7-32c0.4-0.4,0.4-0.4,0.8-0.4c0.4,0,0.4,0,0.4,0l4.5,3.2C64,8.6,64,9,64,9.5c0,0.4,0,0.4-0.4,0.8L34,48.3
            c-0.4,0.4-1.2,0.4-1.6,0L17.8,32.9z"/>
       </svg>
      )
    }
  });
//tslint: enable

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
                {!!device.isPnpDevice &&
                    <span className="device-list-cell-item last">
                        <Icon
                            iconName="pnp-svg"
                            className="icon"
                            ariaLabel={context.t(ResourceKeys.deviceLists.columns.isPnpDevice)}
                        />
                        {context.t(ResourceKeys.deviceLists.columns.isPnpDevice)}
                    </span>}
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
