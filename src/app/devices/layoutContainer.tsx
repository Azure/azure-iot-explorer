/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { DeviceLayout, LayoutDataProps } from './layout';
import { StateType } from '../shared/redux/state';
import { getConnectionStringSelector } from '../login/selectors';

const mapStateToProps = (state: StateType, ownProps: RouteComponentProps): LayoutDataProps => {
    return {
        hubConnectionString: getConnectionStringSelector(state)
    };
};

export default connect(mapStateToProps, undefined, undefined, {
    pure: false,
})(DeviceLayout);
