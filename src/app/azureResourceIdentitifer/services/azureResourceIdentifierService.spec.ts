import { getAzureResourceIdentifiers, getAzureResourceIdentifier, mapPropertyArrayToObject } from './azureResourceIdentifierService';
import { AzureResourceIdentifierType } from '../models/azureResourceIdentifierType';
import { HttpError } from '../../api/models/httpError';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../api/constants';

describe('mapPropertyArrayToObject', () => {
    it('returns expected data structure', () => {
        const fieldNames = [
            'name',
            'id',
            'account'
        ];

        const fieldValues = [
            'myName',
            'myId',
            'myAccount'
        ];

        expect(mapPropertyArrayToObject(fieldNames, fieldValues)).toEqual({
            account: 'myAccount',
            id: 'myId',
            name: 'myName'
        });
    });

    it('maps a value to undefined if fieldName possesses no associated fieldValue', () => {
        const fieldNames = [
            'name',
            'id',
            'account'
        ];

        const fieldValues = [
            'myName',
            'myId'
        ];

        expect(mapPropertyArrayToObject(fieldNames, fieldValues)).toEqual({
            account: undefined,
            id: 'myId',
            name: 'myName'
        });
    });
});

describe('getAzureResourceIdentifiers', () => {
    it('calls fetch with specificed parameters', () => {
        getAzureResourceIdentifiers({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        const resourceUrl = `managementEndpoint/providers/Microsoft.ResourcesGraph/resources?api-version=2019-04-01`;
        const serviceRequestParams = {
            body: JSON.stringify({
                query: `where type =~ 'microsoft.devices/iothubs' | project id,name,type,location,resourceGroup,subscriptionId`,
                subscriptions: ['sub1', 'sub2'],
            }),
            headers: new Headers({
                'Accept': APPLICATION_JSON,
                'Authorization': `Bearer token`,
                'Content-Type': APPLICATION_JSON
            }),
            method: HTTP_OPERATION_TYPES.Post
        };

        expect(fetch).toHaveBeenLastCalledWith(resourceUrl, serviceRequestParams);
    });

    it('calls fetch with specificed parameters when continuation token provided', () => {
        getAzureResourceIdentifiers({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            continuationToken: 'continuationToken',
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        const resourceUrl = `managementEndpoint/providers/Microsoft.ResourcesGraph/resources?api-version=2019-04-01`;
        const serviceRequestParams = {
            body: JSON.stringify({
                query: `where type =~ 'microsoft.devices/iothubs' | project id,name,type,location,resourceGroup,subscriptionId`,
                subscriptions: ['sub1', 'sub2'],
                // tslint:disable-next-line:object-literal-sort-keys
                options: {
                    $skipToken: 'continuationToken'
                }
            }),
            headers: new Headers({
                'Accept': APPLICATION_JSON,
                'Authorization': `Bearer token`,
                'Content-Type': APPLICATION_JSON
            }),
            method: HTTP_OPERATION_TYPES.Post
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

        await expect(getAzureResourceIdentifiers({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        })).rejects.toThrow(httpError);
    });

    it('returns empty array when no data object present', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {};
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureResourceIdentifiers({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        expect(result).toEqual({
            continuationToken: undefined,
            resultSet: []
        });
    });

    it('returns empty array when no data.rows object present', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {
                    data: {
                    }
                };
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureResourceIdentifiers({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        expect(result).toEqual({
            continuationToken: undefined,
            resultSet: []
        });
    });

    it('returns empty array when no data.rows is empty array', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {
                    data: {
                        rows: []
                    }
                };
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureResourceIdentifiers({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        expect(result).toEqual({
            continuationToken: undefined,
            resultSet: []
        });
    });

    it ('returns expected entries when rows returned', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {
                    data: {
                        rows: [
                            [ 'id1', 'name1', 'type1', 'location1', 'resourceGroup1', 'sub1'],
                            [ 'id2', 'name2', 'type1', 'location2', 'resourceGroup2', 'sub2']
                        ]
                    }
                };
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureResourceIdentifiers({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        expect(result).toEqual({
            continuationToken: undefined,
            resultSet: [
                {
                    id: 'id1',
                    location: 'location1',
                    name: 'name1',
                    resourceGroup: 'resourceGroup1',
                    subscriptionId: 'sub1',
                    type: 'type1',
                },
                {
                    id: 'id2',
                    location: 'location2',
                    name: 'name2',
                    resourceGroup: 'resourceGroup2',
                    subscriptionId: 'sub2',
                    type: 'type1',
                },
            ]
        });
    });

    it ('returns continuationToken when defined', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {
                    $skipToken: 'skipToken',
                    data: {
                        rows: [
                            [ 'id1', 'name1', 'type1', 'location1', 'resourceGroup1', 'sub1'],
                            [ 'id2', 'name2', 'type1', 'location2', 'resourceGroup2', 'sub2']
                        ]
                    }
                };
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureResourceIdentifiers({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        expect(result).toEqual({
            continuationToken: 'skipToken',
            resultSet: [
                {
                    id: 'id1',
                    location: 'location1',
                    name: 'name1',
                    resourceGroup: 'resourceGroup1',
                    subscriptionId: 'sub1',
                    type: 'type1',
                },
                {
                    id: 'id2',
                    location: 'location2',
                    name: 'name2',
                    resourceGroup: 'resourceGroup2',
                    subscriptionId: 'sub2',
                    type: 'type1',
                },
            ]
        });
    });
});

describe('getAzureResourceIdentifier', () => {
    it('calls fetch with specificed parameters', () => {
        getAzureResourceIdentifier({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceName: 'resourceName',
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        const resourceUrl = `managementEndpoint/providers/Microsoft.ResourcesGraph/resources?api-version=2019-04-01`;
        const serviceRequestParams = {
            body: JSON.stringify({
                query: `where type =~ 'microsoft.devices/iothubs' and name =~ 'resourceName' | project id,name,type,location,resourceGroup,subscriptionId`,
                subscriptions: ['sub1', 'sub2'],
            }),
            headers: new Headers({
                'Accept': APPLICATION_JSON,
                'Authorization': `Bearer token`,
                'Content-Type': APPLICATION_JSON
            }),
            method: HTTP_OPERATION_TYPES.Post
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

        await expect(getAzureResourceIdentifier({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceName: 'resourceName',
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        })).rejects.toThrow(httpError);
    });

    it('returns undefined when no data returned', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {
                    data: {
                    }
                };
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureResourceIdentifier({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceName: 'resourceName',
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        expect(result).toEqual(undefined);
    });

    it('returns undefined when rows empty array', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {
                    data: {
                        rows: []
                    }
                };
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureResourceIdentifier({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceName: 'resourceName',
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        expect(result).toEqual(undefined);
    });

    it('returns first entry of results', async () => {
        jest.spyOn(window, 'fetch').mockResolvedValue({
            json: () => {
                return {
                    data: {
                        rows: [
                            [ 'id1', 'name1', 'type1', 'location1', 'resourceGroup1', 'sub1'],
                            [ 'id2', 'name2', 'type1', 'location2', 'resourceGroup2', 'sub2']
                        ]
                    }
                };
            },
            ok: true,

        } as any); // tslint:disable-line:no-any

        const result = await getAzureResourceIdentifier({
            azureResourceManagementEndpoint: {
                authorizationToken: 'token',
                endpoint: 'managementEndpoint'
            },
            resourceName: 'resourceName',
            resourceType: AzureResourceIdentifierType.IoTHub,
            subscriptionIds: ['sub1', 'sub2']
        });

        expect(result).toEqual({
            id: 'id1',
            location: 'location1',
            name: 'name1',
            resourceGroup: 'resourceGroup1',
            subscriptionId: 'sub1',
            type: 'type1',
        });
    });
});
