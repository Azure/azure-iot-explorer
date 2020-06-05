/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch, Route } from 'react-router-dom';
import { ROUTE_PARTS } from '../../../../constants/routes';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { getDigitalTwinAction, getModelDefinitionAction } from '../actions';
import { PnpStateContextProvider } from '../pnpStateContext';
import { DigitalTwinDetail } from './digitalTwinDetail';
import { useAsyncSagaReducer } from '../../../../shared/hooks/useAsyncSagaReducer';
import { pnpReducer } from '../reducer';
import { pnpSaga } from '../saga';
import { pnpStateInitial } from '../state';
import { getRepositoryLocationSettingsSelector, getLocalFolderPathSelector } from '../../../../modelRepository/selectors';
import { RepositoryLocationSettings } from '../../../../modelRepository/state';
import { DigitalTwinInterfacesList } from './digitalTwinInterfacesList';
import '../../../../css/_digitalTwinInterfaces.scss';

// tslint:disable-next-line: cyclomatic-complexity
export const Pnp: React.FC = () => {
    const { search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    const { t } = useLocalizationContext();
    const locations: RepositoryLocationSettings[] = useSelector(getRepositoryLocationSettingsSelector);
    const localFolderPath: string = useSelector(getLocalFolderPathSelector);

    const [ pnpState, dispatch ] = useAsyncSagaReducer(pnpReducer, pnpSaga, pnpStateInitial());
    const digitalTwin = pnpState.digitalTwin.payload as any; // tslint:disable-line: no-any
    const modelId = digitalTwin &&  digitalTwin.$metadata && digitalTwin.$metadata.$model;

    React.useEffect(() => {
        dispatch(getDigitalTwinAction.started(deviceId));
    },              []);

    React.useEffect(() => {
        if (!modelId) {
            return;
        }
        getModelDefinition();
    },              [modelId]);

    const getModelDefinition = () => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId: modelId, locations, localFolderPath}));

    return (
        <PnpStateContextProvider value={{ pnpState, dispatch, getModelDefinition }}>
            <Route path={url} exact={true} component={DigitalTwinInterfacesList}/>
            <Route path={`${url}/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`} component={DigitalTwinDetail}/>
        </PnpStateContextProvider>
    );
};
