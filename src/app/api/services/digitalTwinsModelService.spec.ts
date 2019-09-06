/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as DigitalTwinsModelService from './digitalTwinsModelService';
import { API_VERSION, DIGITAL_TWIN_API_VERSION } from '../../constants/apiConstants';
import { HTTP_OPERATION_TYPES } from '../constants';

describe('digitalTwinsModelService', () => {

    context('fetchModel', () => {
        const parameters = {
            expand: undefined,
            id: 'urn:azureiot:ModelDiscovery:ModelInformation:1',
            repoServiceHostName: 'canary-repo.azureiotrepository.com',
            repositoryId: 'repositoryId',
            token: 'SharedAccessSignature sr=canary-repo.azureiotrepository.com&sig=123&rid=repositoryId'
        };

        it('calls fetch with specified parameters', () => {
            DigitalTwinsModelService.fetchModel(parameters);

            const expandQueryString = parameters.expand ? `&expand=true` : ``;
            const repositoryQueryString = parameters.repositoryId ? `&repositoryId=${parameters.repositoryId}` : '';
            const apiVersionQuerySTring = `?${API_VERSION}${DIGITAL_TWIN_API_VERSION}`;
            const queryString = `${apiVersionQuerySTring}${expandQueryString}${repositoryQueryString}`;
            const modelIdentifier = encodeURIComponent(parameters.id);
            const resourceUrl = `https://${parameters.repoServiceHostName}/models/${modelIdentifier}${queryString}`;

            const controllerRequest = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': parameters.token || '',
                    'Content-Type': 'application/json'
                },
                method: HTTP_OPERATION_TYPES.Get,
                uri: resourceUrl
            };

            const fetchModelParameters = {
                body: JSON.stringify(controllerRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                method: HTTP_OPERATION_TYPES.Post
            };

            expect(fetch).toBeCalledWith(DigitalTwinsModelService.CONTROLLER_ENDPOINT, fetchModelParameters);
        });

        it('returns model when response is 200', async () => {
            // tslint:disable
            const model = {
                '@id': 'urn:azureiot:Client:SDKInformation:1',
                '@type': 'Interface',
                'displayName': 'Digital Twin Client SDK Information',
                'contents': [
                    {
                        '@type': 'Property',
                        'name': 'language',
                        'displayName': 'SDK Language',
                        'schema': 'string',
                        'description': 'The language for the Digital Twin client SDK. For example, Java.'
                    },
                    {
                        '@type': 'Property',
                        'name': 'version',
                        'displayName': 'SDK Version',
                        'schema': 'string',
                        'description': 'Version of the Digital Twin client SDK. For example, 1.3.45.'
                    },
                    {
                        '@type': 'Property',
                        'name': 'vendor',
                        'displayName': 'SDK Vendor',
                        'schema': 'string',
                        'description': 'Name of the vendor who authored the SDK.  For example, Microsoft.'
                    }
                ],
                '@context': 'http://azureiot.com/v1/contexts/IoTModel.json'
            };
            const response = {
                json: () => model,
                headers: {has: () => {}},
                ok: true
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DigitalTwinsModelService.fetchModel(parameters);
            expect(result).toEqual({
                createdOn: '',
                etag: '',
                lastUpdated: '',
                model,
                modelId: '',
                publisherId: '',
                publisherName: ''
            });
        });

        it('throws Error when response is not OK', async () => {
            // tslint:disable
            const response = {
                ok: false,
                statusText: 'Not found'
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            await expect(DigitalTwinsModelService.fetchModel(parameters)).rejects.toThrow(new Error('Not found'));
        });
    });
});
