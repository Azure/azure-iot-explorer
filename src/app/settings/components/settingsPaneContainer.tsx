/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AnyAction } from 'typescript-fsa';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { StateType } from '../../shared/redux/state';
import SettingsPane, { SettingsPaneActionProps, SettingsPaneDataProps } from './settingsPane';

const mapStateToProps = (state: StateType): SettingsPaneDataProps => {
    return {
        isOpen: false
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): SettingsPaneActionProps => {
    return {
        // tslint:disable-next-line: no-empty
        toggleVisibility: () => {}
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SettingsPane);
