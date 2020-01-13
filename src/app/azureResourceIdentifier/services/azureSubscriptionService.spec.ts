import { getAzureSubscriptions } from './azureSubscriptionService';
import { HttpError } from '../../api/models/httpError';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../api/constants';

describe('getAzureSubscriptions', () => {
    it('calls fetch with expected parameters', () => {
        getAzureSubscriptions({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
        });

        const resourceUrl = `managementEndpoint/subscriptions?api-version=2019-06-01`;
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
        const httpError = new HttpError(0);
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {};
            },
            ok: false,

        } as any); // tslint:disable-line:no-any

        await expect(getAzureSubscriptions({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
        })).rejects.toThrow(httpError);
    });

    it('returns expected data', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return { value: [
                    {
                        id: 'id1',
                        subscriptionId: 'sub1',
                        tenantId: 'tenant1'
                    },
                    {
                        id: 'id2',
                        subscriptionId: 'sub2',
                        tenantId: 'tenant2'
                    }
                ]};
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureSubscriptions({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
        });

        expect(result).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(result[0]).toEqual({
            id: 'id1',
            subscriptionId: 'sub1',
            tenantId: 'tenant1'
        });

        expect(result[1]).toEqual({
            id: 'id2',
            subscriptionId: 'sub2',
            tenantId: 'tenant2'
        });
    });

});
