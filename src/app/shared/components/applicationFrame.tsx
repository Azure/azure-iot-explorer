import * as React from 'react';
import { Route } from 'react-router-dom';
import Breadcrumb from './breadcrumb';
import { Header } from './header';
import '../../css/_applicationFrame.scss';

export const ApplicationFrame: React.FC = props => {
    return (
        <div className="app">
            <div className="masthead">
                <Header />
            </div>

            <nav className="navigation">
                <Route component={Breadcrumb} />
            </nav>

            <main role="main" className="content">
                {props.children}
            </main>
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
