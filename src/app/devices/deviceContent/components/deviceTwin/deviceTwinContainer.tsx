/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import DeviceTwin, { DeviceTwinDataProps, DeviceTwinDispatchProps } from './deviceTwin';
import { getDeviceTwinSelector, getDeviceTwinStateSelector } from './selectors';
import { getTwinAction, updateTwinAction, UpdateTwinActionParameters } from '../../actions';

const mapStateToProps = (state: StateType): DeviceTwinDataProps => {
    return {
        twin: getDeviceTwinSelector(state),
        twinState : getDeviceTwinStateSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DeviceTwinDispatchProps => {
    return {
        getDeviceTwin: (deviceId: string) => dispatch(getTwinAction.started(deviceId)),
        updateDeviceTwin: (parameters: UpdateTwinActionParameters) => dispatch(updateTwinAction.started(parameters))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceTwin);
