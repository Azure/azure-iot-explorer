import { compose } from 'redux';
import { connect } from 'react-redux';
import Themer, { Theme } from './themer';
import { StateType } from './app/shared/redux/state';
import { getApplicationThemeSelector } from './app/settings/selectors';
import { THEME_DARK, THEME_LIGHT } from './app/constants/themes';

const mapStateToProps = (state: StateType) => {
    const theme = getApplicationThemeSelector(state);
    return {
        officeTheme: theme === Theme.dark ? THEME_DARK : THEME_LIGHT,
        theme
    };
};

export default compose(connect(mapStateToProps))(Themer);
