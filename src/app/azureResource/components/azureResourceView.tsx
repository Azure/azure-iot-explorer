import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, RouteComponentProps, Redirect } from 'react-router-dom';
import { StateInterface } from '../../shared/redux/state';
import DeviceContentContainer from '../../devices/deviceContent/components/deviceContentContainer';
import DeviceListContainer from '../../devices/deviceList/components/deviceListContainer';
import AddDeviceContainer from '../../devices/deviceList/components/addDevice/components/addDeviceContainer';
import SettingsPaneContainer from '../../settings/components/settingsPaneContainer';
import HeaderContainer from '../../shared/components/headerContainer';
import { ROUTE_PARTS } from '../../constants/routes';
import { setActiveAzureResourceByHostNameAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';

export type AzureResourceViewProps = RouteComponentProps;

export const AzureResourceView: React.FC<AzureResourceViewProps> = props => {
    const url = props.match.url;
    const dispatch = useDispatch();
    const hostName = (props.match.params as { hostName: string}).hostName;
    const currentAzureResource = useSelector((state: StateInterface) => state.azureResourceState.currentAzureResource);

    React.useEffect(() => {
        if (currentAzureResource && currentAzureResource.hostName === hostName) {
            return;
        }

        dispatch(setActiveAzureResourceByHostNameAction({ hostName }));
    }, [url]); // tslint:disable-line:align

    // tslint:disable-next-line:cyclomatic-complexity
    const renderContents = (): JSX.Element => {
        if (!currentAzureResource || currentAzureResource.hostName !== hostName) {
            return (<div />);
        }

        if (currentAzureResource.accessVerificationState === AccessVerificationState.Verifying) {
            return (<div>Verifying Access</div>);
        }

        if (currentAzureResource.accessVerificationState === AccessVerificationState.Unauthorized) {
            return (<div>you are not authorized</div>);
        }

        if (currentAzureResource.accessVerificationState === AccessVerificationState.Failed) {
            return (<div>Unable to determine authorization</div>);
        }

        return (
            <>
                <Route path={`${url}/${ROUTE_PARTS.DEVICES}`} component={DeviceListContainer} exact={true}/>
                <Route path={`${url}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.ADD}`} component={AddDeviceContainer} exact={true} />
                <Route path={`${url}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/`} component={DeviceContentContainer}/>
            </>
        );
    };

    return (
        <div className="app">
            <HeaderContainer />
            <div className="content">
                <SettingsPaneContainer />
                <main role="main">
                    {renderContents()}
                </main>
            </div>
        </div>
    );
};
