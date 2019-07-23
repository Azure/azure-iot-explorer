/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AnyAction } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StateType } from '../redux/state';
import Header, { HeaderProps, HeaderActions } from './header';
import { setSettingsVisibilityAction } from '../../settings/actions';
import { getSettingsVisibleSelector } from '../../settings/selectors';

const mapStateToProps = (state: StateType): HeaderProps => {
    return {
        settingsVisible: getSettingsVisibleSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): HeaderActions => {
    return {
        onSettingsVisibilityChanged: (visible: boolean) => {
            dispatch(setSettingsVisibilityAction(visible));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
