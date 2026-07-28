/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { PUBLIC_MODEL_REPOSITORY } from '../../../../public/constants';
import { HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { FetchModelParameters } from '../parameters/repoParameters';
import { convertModelIdentifier } from './publicDigitalTwinsModelRepoService';

export class PublicDigitalTwinsModelRepoHelper implements PublicDigitalTwinsModelInterface{
    public getModelDefinition = async (params: FetchModelParameters): Promise<Response> => {
        const modelIdentifier = convertModelIdentifier(params.id);
        const resourceUrl = params.url
            ? `https://${params.url}/${encodeURIComponent(modelIdentifier)}`
            : `${PUBLIC_MODEL_REPOSITORY.RAW_URL}/${modelIdentifier}`;

        return fetch(
            resourceUrl,
            {
                headers: new Headers({
                    'Accept': 'application/json'
                }),
                method: HTTP_OPERATION_TYPES.Get
            }
        );
    }
}

export interface PublicDigitalTwinsModelInterface {
    getModelDefinition: (params: FetchModelParameters) => Promise<Response>;
}
