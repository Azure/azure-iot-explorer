/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as DigitalTwinsModelService from './publicDigitalTwinsModelRepoService';
import { API_VERSION, MODEL_REPO_API_VERSION, HTTP_OPERATION_TYPES, PUBLIC_REPO_HOSTNAME } from '../../constants/apiConstants';

describe('digitalTwinsModelService', () => {

    const model = {
        '@id': 'urn:azureiot:ModelDiscovery:ModelInformation;1',
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

    context('fetchModel', () => {
        const parameters = {
            expand: undefined,
            id: 'urn:azureiot:ModelDiscovery:ModelInformation;1',
            token: 'SharedAccessSignature sr=canary-repo.azureiotrepository.com&sig=123&rid=repositoryId'
        };

        it('converts model id to required format', () => {
            expect(DigitalTwinsModelService.convertModelIdentifier(parameters.id)).toEqual('urn/azureiot/modeldiscovery/modelinformation-1.json');
        });

        it('calls fetch with specified parameters and returns model when response is 200', async () => {
            // tslint:disable
            const response = {
                json: () => model,
                headers: {has: () => {}},
                ok: true
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DigitalTwinsModelService.fetchModel(parameters);
            const modelIdentifier = encodeURIComponent(DigitalTwinsModelService.convertModelIdentifier(parameters.id));
            const resourceUrl = `https://${PUBLIC_REPO_HOSTNAME}/${modelIdentifier}`;

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
            expect(result).toEqual({
                createdDate: '',
                etag: '',
                model,
                modelId: '',
                publisherId: '',
                publisherName: ''
            });
        });

        it('calls fetch and returns model in array when response is 200', async () => {
            const testModel = [model];
            // tslint:disable
            const response = {
                json: () => testModel,
                headers: {has: () => {}},
                ok: true
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DigitalTwinsModelService.fetchModel(parameters);

            expect(result).toEqual({
                createdDate: '',
                etag: '',
                model: testModel[0],
                modelId: '',
                publisherId: '',
                publisherName: ''
            });
        });

        it('throws Error when response is not OK', async done => {
            // tslint:disable
            const response = {
                ok: false,
                statusText: 'Not found'
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            await expect(DigitalTwinsModelService.fetchModel(parameters)).rejects.toThrow(new Error('Not found'));
            done();
        });
    });

    context('validateModelDefinitions', () => {
        const parameters = JSON.stringify([]);

        it('calls fetch with specified parameters and returns true when response is 200', async () => {
            // tslint:disable
            const response = {
                json: () => {},
                ok: true
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DigitalTwinsModelService.validateModelDefinitions(parameters);

            const apiVersionQueryString = `?${API_VERSION}${MODEL_REPO_API_VERSION}`;
            const controllerRequest = {
                body: parameters,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-ms-client-request-id': 'azure iot explorer: validate model definition'
                },
                method: HTTP_OPERATION_TYPES.Post,
                uri: `https://${PUBLIC_REPO_HOSTNAME}/models/validate${apiVersionQueryString}`
            };

            const validateModelParameters = {
                body: JSON.stringify(controllerRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                method: HTTP_OPERATION_TYPES.Post
            };

            expect(fetch).toBeCalledWith(DigitalTwinsModelService.CONTROLLER_ENDPOINT, validateModelParameters);
            expect(result).toEqual(true);
        });
    });
});
