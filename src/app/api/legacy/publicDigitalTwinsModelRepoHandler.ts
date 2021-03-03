/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { CONTROLLER_API_ENDPOINT, HTTP_OPERATION_TYPES, PUBLIC_REPO_HOSTNAME, MODELREPO } from '../../constants/apiConstants';
import { FetchModelParameters } from '../parameters/repoParameters';
import { convertModelIdentifier } from '../services/publicDigitalTwinsModelRepoService';
import { PublicDigitalTwinsModelInterface } from '../services/publicDigitalTwinsModelRepoHelper';

interface RequestInitWithUri extends RequestInit {
    uri: string;
    headers?: Record<string, string>;
}

const CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${MODELREPO}`;

export class PublicDigitalTwinsModelRepoHandler implements PublicDigitalTwinsModelInterface {
    public getModelDefinition = async (params: FetchModelParameters): Promise<Response> => {
        const modelIdentifier = encodeURIComponent(convertModelIdentifier(params.id));
        const hostName = params.url || PUBLIC_REPO_HOSTNAME;
        const resourceUrl = `https://${hostName}/${modelIdentifier}`;

        const controllerRequest: RequestInitWithUri = {
            headers: {
                'Accept': 'application/json',
                'Authorization': params.token || '',
                'Content-Type': 'application/json'
            },
            method: HTTP_OPERATION_TYPES.Get,
            uri: resourceUrl
        };

        return this.request(controllerRequest);
    }

    private request = async (requestInit: RequestInitWithUri) => {
        return fetch(
            CONTROLLER_ENDPOINT,
            {
                body: JSON.stringify(requestInit),
                cache: 'no-cache',
                credentials: 'include',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                method: HTTP_OPERATION_TYPES.Post
            }
        );
    }
}
