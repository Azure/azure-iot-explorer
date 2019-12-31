/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import AddModuleIdentityComponent, { AddModuleIdentityDataProps, AddModuleIdentityDispatchProps } from './addModuleIdentity';
import { addModuleIdentityAction } from '../../actions';
import { getModuleIdentityListWrapperSelector } from '../../selectors';
import { ModuleIdentity } from '../../../../api/models/moduleIdentity';

const mapStateToProps = (state: StateType): AddModuleIdentityDataProps => {
    const moduleIdentityListWrapper = getModuleIdentityListWrapperSelector(state);
    return {
        synchronizationStatus: moduleIdentityListWrapper && moduleIdentityListWrapper.synchronizationStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch): AddModuleIdentityDispatchProps => {
    return {
        addModuleIdentity: (moduleIdentity: ModuleIdentity) => dispatch(addModuleIdentityAction.started(moduleIdentity)),
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AddModuleIdentityComponent);
