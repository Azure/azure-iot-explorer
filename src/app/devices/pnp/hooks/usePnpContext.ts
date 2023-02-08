/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useModelRepositoryContext } from '../../../shared/modelRepository/context/modelRepositoryStateContext';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { getModelDefinitionAction } from '../actions';
import { pnpStateInitial } from '../state';
import { pnpReducer } from '../reducer';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { pnpSaga } from '../saga';

export const usePnpContext = () => {
    const [ pnpState, dispatch ] = useAsyncSagaReducer(pnpReducer, pnpSaga, pnpStateInitial(), 'pnpState');
    const { search } = useLocation();
    const [ modelRepositoryState ] = useModelRepositoryContext();

    const deviceId = getDeviceIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);
    const twin = pnpState.twin.payload;
    const modelId = twin?.modelId;
    const interfaceIdModified = React.useMemo(() => interfaceId || modelId, [modelId, interfaceId]);

    const getModelDefinition = () => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId: interfaceIdModified, locations: modelRepositoryState}));
    return { pnpState, dispatch, getModelDefinition };
};
