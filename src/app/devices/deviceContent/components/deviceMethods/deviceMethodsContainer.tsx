/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DeviceMethods, { DeviceMethodsProps } from './deviceMethods';
import { StateType } from '../../../../shared/redux/state';
import { getDeviceIdentityWrapperSelector, getInvokeMethodResponseSelector } from '../../selectors';
import { NonFunctionProperties, FunctionProperties } from '../../../../shared/types/types';
import { getConnectionStringSelector } from '../../../../login/selectors';
import { InvokeMethodParameters } from '../../../../api/parameters/deviceParameters';
import { invokeDeviceMethodAction } from '../../actions';

const mapStateToProps = (state: StateType): NonFunctionProperties<DeviceMethodsProps> => {
    return {
        connectionString: getConnectionStringSelector(state),
        deviceIdentity: getDeviceIdentityWrapperSelector(state),
        invokeMethodResponse: getInvokeMethodResponseSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): FunctionProperties<DeviceMethodsProps> => {
    return {
        onInvokeMethodClick: (parameters: InvokeMethodParameters) => dispatch(invokeDeviceMethodAction.started(parameters))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceMethods);
