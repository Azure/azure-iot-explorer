import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StateType } from '../../../shared/redux/state';
import { DeviceListCellProps, DeviceListCell } from './deviceListCell';
import { NonFunctionProperties, FunctionProperties } from '../../../shared/types/types';
import { getDeviceSummaryWrapper } from '../selectors';
import { fetchInterfacesAction } from '../actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType, ownProps: Partial<DeviceListCellProps>): NonFunctionProperties<DeviceListCellProps> => {
    const device = getDeviceSummaryWrapper(state, ownProps.deviceId);

    return {
        device,
        deviceId: ownProps.deviceId,
        interfaceIds: device.interfaceIds || [],
        isLoading: !device.deviceSummarySynchronizationStatus || device.deviceSummarySynchronizationStatus === SynchronizationStatus.working,
        itemIndex: ownProps.itemIndex
    };
};

const mapDispatchToProps = (dispatch: Dispatch): FunctionProperties<DeviceListCellProps> => {
    return {
        fetchDeviceInfo: (deviceId: string) => dispatch(fetchInterfacesAction.started(deviceId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceListCell);
