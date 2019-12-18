import * as React from 'react';
// import { useDispatch } from 'react-redux';
import { Route, RouteComponentProps } from 'react-router-dom';
import DeviceContentContainer from '../../devices/deviceContent/components/deviceContentContainer';
import DeviceListContainer from '../../devices/deviceList/components/deviceListContainer';
import AddDeviceContainer from '../../devices/deviceList/components/addDevice/components/addDeviceContainer';
import SettingsPaneContainer from '../../settings/components/settingsPaneContainer';
import HeaderContainer from '../../shared/components/headerContainer';
import { ROUTE_PARTS } from '../../constants/routes';

export type AzureResource = RouteComponentProps;

export const AzureResource: React.FC<AzureResource> = props => {
    const url = props.match.url;
    // const { accountName } = useAccount();

    React.useEffect(() => {
        // tslint:disable-next-line:no-console
        console.log('itsa me, luigi');

        // tslint:disable-next-line:no-console
        console.log(url);

    }, [url]); // tslint:disable-line:align

    // if (!accountName) {
    //     return (
    //         <div>Hello world</div>
    //     );
    // }

    return (
        <div className="app">
            <HeaderContainer />
            <div className="content">
                <SettingsPaneContainer />
                <main role="main">
                    <Route path={`${url}/${ROUTE_PARTS.DETAIL}/`} component={DeviceContentContainer}/>
                    <Route exact={true} path={`${url}/${ROUTE_PARTS.DEVICES}`} component={DeviceListContainer}/>
                    <Route exact={true} path={`${url}/${ROUTE_PARTS.ADD}`} component={AddDeviceContainer} />
                </main>
            </div>
        </div>
    );
};
