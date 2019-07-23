/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import DeviceEventsComponent, { DeviceEventsDataProps } from './deviceEvents';
import { getConnectionStringSelector } from '../../../../login/selectors';

const mapStateToProps = (state: StateType): DeviceEventsDataProps => {
    return {
        connectionString: getConnectionStringSelector(state)
    };
};

export default connect(mapStateToProps)(DeviceEventsComponent);
