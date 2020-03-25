import * as React from 'react';
import { Route } from 'react-router-dom';
import SettingsPaneContainer from '../../settings/components/settingsPaneContainer';
import HeaderContainer from './headerContainer';
import Breadcrumb from './breadcrumb';
import '../../css/_applicationFrame.scss';

export const ApplicationFrame: React.FC = props => {
    return (
        <div className="app">
            <div className="masthead">
                <HeaderContainer />
            </div>

            <nav className="navigation">
                <Route component={Breadcrumb} />
            </nav>

            <main role="main" className="content">
                {props.children}
            </main>

            <SettingsPaneContainer />
        </div>
    );
};

export const withApplicationFrame = <T, >(Component: React.ComponentType<T>) => {
    return (props: T) => (
        <ApplicationFrame>
            <Component {...props} />
        </ApplicationFrame>
    );
};
