/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import InterfaceNotFoundMessageBox, { InterfaceNotFoundMessageBoxProps } from './interfaceNotFoundMessageBar';
import { setSettingsVisibilityAction } from '../../../../settings/actions';

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): InterfaceNotFoundMessageBoxProps => {
    return {
        settingsVisibleToggle: (visible: boolean) => dispatch(setSettingsVisibilityAction(visible))
    };
};

export default connect(undefined, mapDispatchToProps, undefined, {
    pure: false,
})(InterfaceNotFoundMessageBox);
