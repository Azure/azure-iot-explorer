/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as DigitalTwinsModelService from './publicDigitalTwinsModelRepoService';
import { PUBLIC_MODEL_REPOSITORY } from '../../../../public/constants';
import { HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { appConfig, HostMode } from '../../../appConfig/appConfig';

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
        '@context': 'https://azureiot.com/v1/contexts/IoTModel.json'
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
            appConfig.hostMode = HostMode.Electron;
            // tslint:disable
            const response = {
                json: () => model,
                headers: {has: () => {}},
                ok: true
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DigitalTwinsModelService.fetchModel(parameters);
            const modelIdentifier = DigitalTwinsModelService.convertModelIdentifier(parameters.id);
            const resourceUrl = `${PUBLIC_MODEL_REPOSITORY.RAW_URL}/${modelIdentifier}`;

            const fetchModelParameters = {
                headers: new Headers({
                    'Accept': 'application/json'
                }),
                method: HTTP_OPERATION_TYPES.Get
            };

            expect(fetch).toHaveBeenCalledWith(resourceUrl, fetchModelParameters);
            expect(result).toEqual({
                createdDate: '',
                etag: '',
                model,
                modelId: '',
                publisherId: '',
                publisherName: ''
            });
        });

        it('preserves the encoded model endpoint format for configurable repositories', async () => {
            const response = {
                json: () => model,
                headers: {has: () => {}},
                ok: true
            } as any; // tslint:disable-line:no-any
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            await DigitalTwinsModelService.fetchModel({
                ...parameters,
                url: 'models.example.com'
            });

            const modelIdentifier = encodeURIComponent(DigitalTwinsModelService.convertModelIdentifier(parameters.id));
            expect(fetch).toHaveBeenCalledWith(
                `https://models.example.com/${modelIdentifier}`,
                expect.any(Object)
            );
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
