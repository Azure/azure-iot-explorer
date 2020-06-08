/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation, useRouteMatch, Route } from 'react-router-dom';
import { ROUTE_PARTS } from '../../../../constants/routes';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { getDigitalTwinAction, getModelDefinitionAction } from '../actions';
import { PnpStateContextProvider } from '../pnpStateContext';
import { DigitalTwinDetail } from './digitalTwinDetail';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { pnpReducer } from '../reducer';
import { pnpSaga } from '../saga';
import { pnpStateInitial } from '../state';
import { RepositoryLocationSettings } from '../../../../shared/global/state';
import { useGlobalStateContext } from '../../../../shared/contexts/globalStateContext';
import { getRepositoryLocationSettings } from '../../../../modelRepository/dataHelper';
import '../../../../css/_digitalTwinInterfaces.scss';
import { DigitalTwinInterfacesList, defaultComponentKey } from './digitalTwinInterfacesList';

// tslint:disable-next-line: cyclomatic-complexity
export const Pnp: React.FC = () => {
    const { search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    const { globalState } = useGlobalStateContext();
    const { modelRepositoryState } = globalState;
    const locations: RepositoryLocationSettings[] = getRepositoryLocationSettings(modelRepositoryState);
    const localFolderPath: string =  (modelRepositoryState && modelRepositoryState.localFolderSettings && modelRepositoryState.localFolderSettings.path) || '';

    const [ pnpState, dispatch ] = useAsyncSagaReducer(pnpReducer, pnpSaga, pnpStateInitial());
    const digitalTwin = pnpState.digitalTwin.payload as any; // tslint:disable-line: no-any
    const modelId = digitalTwin &&  digitalTwin.$metadata && digitalTwin.$metadata.$model;

    const interfaceIdModified = React.useMemo(() => !interfaceId || interfaceId === defaultComponentKey ? modelId : interfaceId, [modelId, interfaceId]);
    const getModelDefinition = () => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId: interfaceIdModified, locations, localFolderPath}));

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
            <Route path={`${url}/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`} component={DigitalTwinDetail}/>
        </PnpStateContextProvider>
    );
};
