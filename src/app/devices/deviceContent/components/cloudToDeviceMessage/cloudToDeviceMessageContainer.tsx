/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CloudToDeviceMessage, { CloudToDeviceMessageProps } from './cloudToDeviceMessage';
import { FunctionProperties } from '../../../../shared/types/types';
import { cloudToDeviceMessageAction, CloudToDeviceMessageActionParameters } from '../../actions';

const mapDispatchToProps = (dispatch: Dispatch): FunctionProperties<CloudToDeviceMessageProps> => {
    return {
        onSendCloudToDeviceMessage: (parameters: CloudToDeviceMessageActionParameters) => dispatch(cloudToDeviceMessageAction.started(parameters))
    };
};

export default compose(withRouter, connect(undefined, mapDispatchToProps))(CloudToDeviceMessage);
