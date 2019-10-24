/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as utils from './utils';
import { ParameterType, OperationType } from '../models/deviceQuery';
import { LIST_PLUG_AND_PLAY_DEVICES } from '../../constants/devices';

describe('utils', () => {
    it('builds query string', () => {
        expect(utils.buildQueryString(
            {
                clauses: [
                    {
                        operation: OperationType.equals,
                        parameterType: ParameterType.capabilityModelId,
                        value: 'enabled'
                    }
                ],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: '',
            }
        )).toEqual(`${LIST_PLUG_AND_PLAY_DEVICES} WHERE (HAS_CAPABILITYMODEL('enabled'))`);
        expect(utils.buildQueryString(
            {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: 'device1',
            }
        )).toEqual(`${LIST_PLUG_AND_PLAY_DEVICES} WHERE STARTSWITH(devices.deviceId, 'device1')`);
        expect(utils.buildQueryString(
            {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: '',
            }
        )).toEqual(LIST_PLUG_AND_PLAY_DEVICES + ' ');
        expect(utils.buildQueryString(
            null
        )).toEqual(LIST_PLUG_AND_PLAY_DEVICES);
    });

    it('converts query object to string', () => {
        expect(utils.queryToString(
            {
                clauses: [
                    {
                        operation: OperationType.equals,
                        parameterType: ParameterType.capabilityModelId,
                        value: 'enabled'
                    },
                    {
                    }
                ],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: '',
            }
        )).toEqual(`WHERE (HAS_CAPABILITYMODEL('enabled'))`);
        expect(utils.queryToString(
            {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: 'device1',
            }
        )).toEqual(`WHERE STARTSWITH(devices.deviceId, 'device1')`);
        expect(utils.queryToString(
            {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: '',
            }
        )).toEqual('');
    });

    it('converts clauses to string', () => {
        expect(utils.clauseListToString(null)).toEqual('');
        expect(utils.clauseListToString([
            {
                operation: OperationType.equals,
                parameterType: ParameterType.status,
                value: 'enabled'
            }
        ])).toEqual(`status = 'enabled'`);
        expect(utils.clauseListToString([
            {
                operation: OperationType.equals,
                parameterType: ParameterType.status,
                value: 'enabled'
            },
            {
                operation: OperationType.equals,
                parameterType: ParameterType.status,
                value: 'disabled'
            }
        ])).toEqual(`status = 'enabled' AND status = 'disabled'`);

        expect(utils.clauseListToString([
            {
                operation: OperationType.equals,
                parameterType: ParameterType.capabilityModelId,
                value: 'enabled'
            }
        ])).toEqual(`HAS_CAPABILITYMODEL('enabled')`);

        expect(utils.clauseListToString([
            {
                operation: OperationType.equals,
                parameterType: ParameterType.interfaceId,
                value: 'enabled'
            }
        ])).toEqual(`HAS_INTERFACE('enabled')`);
    });

    it('creates clause item as string', () => {
        expect(utils.clauseItemToString('foo', OperationType.equals, 'bar')).toEqual(`foo = 'bar'`);
        // expect(utils.clauseItemToString('foo', OperationType.greaterThan, 'bar')).toEqual(`foo > 'bar'`);
        // expect(utils.clauseItemToString('foo', OperationType.greaterThanEquals, 'bar')).toEqual(`foo >= 'bar'`);
        // expect(utils.clauseItemToString('foo', OperationType.inequal, 'bar')).toEqual(`foo <> 'bar'`);
        // expect(utils.clauseItemToString('foo', OperationType.lessThan, 'bar')).toEqual(`foo < 'bar'`);
        // expect(utils.clauseItemToString('foo', OperationType.lessThanEquals, 'bar')).toEqual(`foo <= 'bar'`);
        expect(utils.clauseItemToString('foo', OperationType.notEquals, 'bar')).toEqual(`foo != 'bar'`);
    });

    it('handles escaping strings appropriately', () => {
        expect(utils.escapeValue('1')).toEqual('1');
        expect(utils.escapeValue(`'enabled'`)).toEqual(`'enabled'`);
        expect(utils.escapeValue('enabled')).toEqual(`'enabled'`);
        expect(utils.escapeValue(`o'really`)).toEqual(`'o'really'`);
    });

    it('coverts pnp query clauses', () => {
        expect(utils.toPnPClause(utils.PnPQueryPrefix.HAS_CAPABILITY_MODEL, 'urn:contoso:com:EnvironmentalSensor:1')).toEqual(
            `HAS_CAPABILITYMODEL('urn:contoso:com:EnvironmentalSensor', 1)`
        );
        expect(utils.toPnPClause(utils.PnPQueryPrefix.HAS_INTERFACE, 'urn:contoso:com:EnvironmentalSensor')).toEqual(
            `HAS_INTERFACE('urn:contoso:com:EnvironmentalSensor')`
        );
    });

    it('gets connectionObject from hub connection string', () => {
        const connectionObject = utils.getConnectionInfoFromConnectionString('HostName=test.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key');
        expect(connectionObject.hostName = 'test.azure-devices-int.net');
        expect(connectionObject.sharedAccessKeyName = 'iothubowner');
        expect(connectionObject.sharedAccessKey = 'key');
    });

    it('gets connectionObject from repo connection string', () => {
        const connectionObject = utils.getRepoConnectionInfoFromConnectionString('HostName=test.azureiotrepository.com;RepositoryId=123;SharedAccessKeyName=456;SharedAccessKey=key');
        expect(connectionObject.hostName = 'test.azureiotrepository.com');
        expect(connectionObject.repositoryId = '123');
        expect(connectionObject.sharedAccessKeyName = '456');
        expect(connectionObject.sharedAccessKey = 'key');
    });

    it('generates hub sas token ', () => {
        const token = utils.generateSasToken('test.azureiotrepository.com', 'iothubowner', 'key');
        const regex = new RegExp(/^SharedAccessSignature sr=test\.azureiotrepository\.com&sig=.*&se=.*&skn=iothubowner$/);
        expect(regex.test(token)).toBeTruthy();
    });

    it('generates repo sas token ', () => {
        const token = utils.generatePnpSasToken('123', 'test.azureiotrepository.com', '456', 'key');
        const regex = new RegExp(/^SharedAccessSignature sr=test\.azureiotrepository\.com&sig=.*&se=.*&rid=123$/);
        expect(regex.test(token)).toBeTruthy();
    });
});
