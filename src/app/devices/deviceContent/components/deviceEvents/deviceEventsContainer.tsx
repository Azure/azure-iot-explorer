/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import DeviceEventsComponent, { DeviceEventsDataProps } from './deviceEvents';
import { getActiveAzureResourceConnectionStringSelector } from '../../../../azureResource/selectors';

const mapStateToProps = (state: StateType): DeviceEventsDataProps => {
    return {
        connectionString: getActiveAzureResourceConnectionStringSelector(state),
    };
};

export default connect(mapStateToProps)(DeviceEventsComponent);
