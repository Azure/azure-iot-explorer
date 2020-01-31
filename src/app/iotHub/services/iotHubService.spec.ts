/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getSharedAccessSignatureAuthorizationRules } from './iotHubService';
import { HttpError } from '../../api/models/httpError';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../api/constants';
import { AccessRights } from '../models/accessRights';

describe('getSharedAccessSignatureAuthorizationRules', () => {
    it('calls fetch with specified parameters', () => {
        getSharedAccessSignatureAuthorizationRules({
            azureResourceIdentifier: {
                id: '/resourceId',
                location: 'loc1',
                name: 'name1',
                resourceGroup: 'resourceGroup1',
                subscriptionId: 'sub1',
                type: 'type1'
            },
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            }
        });

        const resourceUrl = `https://managementEndpoint/resourceId/listKeys?api-version=2018-04-01`;
        const serviceRequestParams = {
            headers: new Headers({
                'Accept': APPLICATION_JSON,
                'Authorization': `Bearer token`,
                'Content-Type': APPLICATION_JSON
            }),
            method: HTTP_OPERATION_TYPES.Post
        };

        expect(fetch).toHaveBeenCalledWith(resourceUrl, serviceRequestParams);
    });

    it('throws exception when response.ok is false', async () => {
        const httpError = new HttpError(0);
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {};
            },
            ok: false,

        } as any); // tslint:disable-line:no-any

        await expect(getSharedAccessSignatureAuthorizationRules({
            azureResourceIdentifier: {
                id: '/resourceId',
                location: 'loc1',
                name: 'name1',
                resourceGroup: 'resourceGroup1',
                subscriptionId: 'sub1',
                type: 'type1'
            },
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            }
        })).rejects.toThrow(httpError);
    });

    it('returns expected data structure when response is ok', async () => {
        const resultSet = [
            {
                keyName: 'keyName1',
                primaryKey: 'pk1',
                rights: AccessRights.ServiceConnectDeviceConnect,
                secondaryKey: 'sk1'
            },
            {
                keyName: 'keyName2',
                primaryKey: 'pk2',
                rights: AccessRights.ServiceConnect,
                secondaryKey: 'sk2'
            }
        ];

        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {
                    value: resultSet
                };
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getSharedAccessSignatureAuthorizationRules({
            azureResourceIdentifier: {
                id: '/resourceId',
                location: 'loc1',
                name: 'name1',
                resourceGroup: 'resourceGroup1',
                subscriptionId: 'sub1',
                type: 'type1'
            },
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            }
        });

        expect(result).toEqual(resultSet);
    });
});
