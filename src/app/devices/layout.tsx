/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, RouteComponentProps, Redirect } from 'react-router-dom';
import DeviceContentContainer from './deviceContent/components/deviceContentContainer';
import DeviceListContainer from './deviceList/components/deviceListContainer';
import AddDeviceContainer from './deviceList/components/addDevice/components/addDeviceContainer';
import SettingsPaneContainer from '../settings/components/settingsPaneContainer';
import HeaderContainer from '../shared/components/headerContainer';
import { ROUTE_PARTS } from '../constants/routes';

export interface LayoutDataProps {
    hubConnectionString: string;
}

export type LayoutProps = RouteComponentProps & LayoutDataProps;

export class DeviceLayout extends React.Component<LayoutProps> {
    constructor(props: LayoutProps) {
        super(props);
    }

    public render(): JSX.Element {
        const url = this.props.match.url;

        return (
            <>
                {this.props.hubConnectionString ?
                    <div className="app">
                        <HeaderContainer />
                        <div className="content">
                        <SettingsPaneContainer />
                        <main role="main">
                            <Route exact={true} path={`${url}`} component={DeviceListContainer}/>
                            <Route exact={true} path={`${url}/${ROUTE_PARTS.ADD}`} component={AddDeviceContainer} />
                            <Route path={`${url}/${ROUTE_PARTS.DETAIL}/`} component={DeviceContentContainer}/>
                        </main>
                        </div>
                    </div> : <Redirect to="/" />
                }
            </>
        );
    }
}
