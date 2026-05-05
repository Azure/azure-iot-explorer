/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getAzureTenants } from './azureTenantService';
import { HttpError } from '../../api/models/httpError';
import { APPLICATION_JSON } from '../../constants/apiConstants';
import { HTTP_OPERATION_TYPES } from './../../constants/apiConstants';

describe('getAzureTenants', () => {
    it('calls fetch with expected parameters', () => {
        const fetch = jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {};
            },
            ok: true,

        } as any);
        getAzureTenants({
            authorizationToken: 'token',
            endpoint: 'managementEndpoint'
        });

        const resourceUrl = `https://managementEndpoint/tenants?api-version=2020-01-01`;
        const serviceRequestParams = {
            headers: new Headers({
                'Accept': APPLICATION_JSON,
                'Authorization': `Bearer token`,
                'Content-Type': APPLICATION_JSON
            }),
            method: HTTP_OPERATION_TYPES.Get
        };

        expect(fetch).toHaveBeenLastCalledWith(resourceUrl, serviceRequestParams);
    });

    it('throws exception when response.ok is false', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {};
            },
            ok: false,

        } as any);

        await expect(getAzureTenants({
            authorizationToken: 'token',
            endpoint: 'managementEndpoint'
        })).rejects.toThrow();
    });

    it('returns expected data', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return { value: [
                    {
                        tenantId: 'tenant1',
                        displayName: 'Tenant One',
                        tenantCategory: 'Home',
                        defaultDomain: 'tenantone.onmicrosoft.com'
                    },
                    {
                        tenantId: 'tenant2',
                        displayName: 'Tenant Two',
                        tenantCategory: 'Guest',
                        defaultDomain: 'tenanttwo.onmicrosoft.com'
                    }
                ]};
            },
            ok: true,

        } as any);

        const result = await getAzureTenants({
            authorizationToken: 'token',
            endpoint: 'managementEndpoint'
        });

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            tenantId: 'tenant1',
            displayName: 'Tenant One',
            tenantCategory: 'Home',
            defaultDomain: 'tenantone.onmicrosoft.com'
        });

        expect(result[1]).toEqual({
            tenantId: 'tenant2',
            displayName: 'Tenant Two',
            tenantCategory: 'Guest',
            defaultDomain: 'tenanttwo.onmicrosoft.com'
        });
    });

});
