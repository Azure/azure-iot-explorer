/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation, useRouteMatch, Route } from 'react-router-dom';
import { ROUTE_PARTS } from '../../../constants/routes';
import { useConnectionStringContext } from '../../../connectionStrings/context/connectionStringContext';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString, getModuleIdentityIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { PnpStateContextProvider } from '../context/pnpStateContext';
import { DigitalTwinDetail } from './modelConfiguration/digitalTwinDetail';
import { DigitalTwinInterfacesList } from './modelConfiguration/digitalTwinInterfacesList';
import { BreadcrumbRoute } from '../../../navigation/components/breadcrumbRoute';
import { dispatchGetTwinAction } from '../utils';
import { usePnpContext } from '../hooks/usePnpContext';
import '../../../css/_digitalTwinInterfaces.scss';

export const Pnp: React.FC = () => {
    const { search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);

    const { pnpState, dispatch, getModelDefinition } = usePnpContext();
    const [ {connectionString} ] = useConnectionStringContext();
    const twin = pnpState.twin.payload;
    const modelId = twin?.modelId;
    const interfaceIdModified = React.useMemo(() => interfaceId || modelId, [modelId, interfaceId]);

    React.useEffect(() => {
        dispatchGetTwinAction(search, connectionString, dispatch);
    },              [deviceId, moduleId]);

    React.useEffect(() => {
        if (interfaceIdModified && deviceId) {
            getModelDefinition();
        }
    },              [interfaceIdModified, deviceId]);

    return (
        <PnpStateContextProvider value={{ pnpState, dispatch, getModelDefinition }}>
            <Route path={url} exact={true} component={DigitalTwinInterfacesList}/>
            <BreadcrumbRoute
                path={`${url}/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`}
                breadcrumb={{name: componentName}}
                children={<DigitalTwinDetail/>}
            />
        </PnpStateContextProvider>
    );
};
