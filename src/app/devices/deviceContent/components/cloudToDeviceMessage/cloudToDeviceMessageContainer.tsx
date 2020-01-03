/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CloudToDeviceMessage, { CloudToDeviceMessageProps } from './cloudToDeviceMessage';
import { StateType } from '../../../../shared/redux/state';
import { NonFunctionProperties, FunctionProperties } from '../../../../shared/types/types';
import { CloudToDeviceMessageParameters } from '../../../../api/parameters/deviceParameters';
import { cloudToDeviceMessageAction } from '../../actions';

const mapStateToProps = (state: StateType): NonFunctionProperties<CloudToDeviceMessageProps> => {
    return {
        connectionString: state.azureResourceState.activeAzureResource ? state.azureResourceState.activeAzureResource.connectionString : ''
    };
};

const mapDispatchToProps = (dispatch: Dispatch): FunctionProperties<CloudToDeviceMessageProps> => {
    return {
        onSendCloudToDeviceMessage: (parameters: CloudToDeviceMessageParameters) => dispatch(cloudToDeviceMessageAction.started(parameters))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(CloudToDeviceMessage);
