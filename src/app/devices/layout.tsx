/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, RouteComponentProps, Redirect } from 'react-router-dom';
import DeviceContentContainer from './deviceContent/components/deviceContentContainer';
import DeviceListContainer from './deviceList/components/deviceListContainer';
import AddDeviceContainer from './deviceList/components/addDevice/components/addDeviceContainer';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString } from '../shared/utils/queryStringHelper';
import SettingsPaneContainer from '../settings/components/settingsPaneContainer';

export interface LayoutDataProps {
    hubConnectionString: string;
}

export class DeviceLayout extends React.Component<LayoutDataProps> {
    constructor(props: LayoutDataProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <>
                {this.props.hubConnectionString ?
                    <>
                        <SettingsPaneContainer />
                        <main role="main">
                            <Route exact={true} path="/devices/" component={DeviceListContainer}/>
                            <Route exact={true} path="/devices/add" component={AddDeviceContainer} />
                            <Route path="/devices/detail/" component={this.renderDeviceContent}/>
                        </main>
                    </> : <Redirect to="/" />
                }
            </>
        );
    }

    private readonly renderDeviceContent = (props: RouteComponentProps) => {
        return (
            <DeviceContentContainer
                deviceId={getDeviceIdFromQueryString(props)}
                interfaceId={getInterfaceIdFromQueryString(props)}
            />
        );
    }
}
