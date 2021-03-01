/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation, useRouteMatch, Route } from 'react-router-dom';
import { ROUTE_PARTS } from '../../../constants/routes';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString } from '../../../shared/utils/queryStringHelper';
import { getDigitalTwinAction, getModelDefinitionAction } from '../actions';
import { PnpStateContextProvider } from '../../../shared/contexts/pnpStateContext';
import { DigitalTwinDetail } from './digitalTwinDetail';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { pnpReducer } from '../reducer';
import { pnpSaga } from '../saga';
import { pnpStateInitial } from '../state';
import { RepositoryLocationSettings } from '../../../shared/global/state';
import { useGlobalStateContext } from '../../../shared/contexts/globalStateContext';
import { getRepositoryLocationSettings } from '../../../modelRepository/dataHelper';
import { DigitalTwinInterfacesList } from './digitalTwinInterfacesList';
import { BreadcrumbRoute } from '../../../navigation/components/breadcrumbRoute';
import '../../../css/_digitalTwinInterfaces.scss';

export const Pnp: React.FC = () => {
    const { search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);

    const { globalState } = useGlobalStateContext();
    const { modelRepositoryState } = globalState;
    const locations: RepositoryLocationSettings[] = getRepositoryLocationSettings(modelRepositoryState);

    const [ pnpState, dispatch ] = useAsyncSagaReducer(pnpReducer, pnpSaga, pnpStateInitial(), 'pnpState');
    const digitalTwin = pnpState.digitalTwin.payload as any; // tslint:disable-line: no-any
    const modelId = digitalTwin &&  digitalTwin.$metadata && digitalTwin.$metadata.$model;

    const interfaceIdModified = React.useMemo(() => interfaceId || modelId, [modelId, interfaceId]);
    const getModelDefinition = () => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId: interfaceIdModified, locations}));

    React.useEffect(() => {
        dispatch(getDigitalTwinAction.started(deviceId));
    },              []);

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
