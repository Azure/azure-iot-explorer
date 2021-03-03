/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { HTTP_OPERATION_TYPES, PUBLIC_REPO_HOSTNAME } from '../../constants/apiConstants';
import { FetchModelParameters } from '../parameters/repoParameters';
import { convertModelIdentifier } from './publicDigitalTwinsModelRepoService';

export class PublicDigitalTwinsModelRepoHelper implements PublicDigitalTwinsModelInterface{
    public getModelDefinition = async (params: FetchModelParameters): Promise<Response> => {
        const modelIdentifier = encodeURIComponent(convertModelIdentifier(params.id));
        const hostName = params.url || PUBLIC_REPO_HOSTNAME;
        const resourceUrl = `https://${hostName}/${modelIdentifier}`;

        return fetch(
            resourceUrl,
            {
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                method: HTTP_OPERATION_TYPES.Get
            }
        );
    }
}

export interface PublicDigitalTwinsModelInterface {
    getModelDefinition: (params: FetchModelParameters) => Promise<Response>;
}
