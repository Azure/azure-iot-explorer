/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import DeviceEventsComponent, { DeviceEventsDataProps } from './deviceEvents';

const mapStateToProps = (state: StateType): DeviceEventsDataProps => {
    return {
        connectionString: state.azureResourceState.activeAzureResource ? state.azureResourceState.activeAzureResource.connectionString : '',
    };
};

export default connect(mapStateToProps)(DeviceEventsComponent);
