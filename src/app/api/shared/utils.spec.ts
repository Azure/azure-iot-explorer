/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as utils from './utils';
import { ParameterType, OperationType, DeviceCapability, DeviceStatus } from '../models/deviceQuery';
import { LIST_IOT_DEVICES } from '../../constants/devices';

describe('utils', () => {
    it('builds query string', () => {
        expect(utils.buildQueryString(
            {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: 'device1',
            }
        )).toEqual(`${LIST_IOT_DEVICES} WHERE STARTSWITH(devices.deviceId, 'device1')`);

        expect(utils.buildQueryString(
            {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: '',
            }
        )).toEqual(LIST_IOT_DEVICES + ' ');

        expect(utils.buildQueryString(
            null
        )).toEqual(LIST_IOT_DEVICES);

        expect(utils.buildQueryString(
            {
                clauses: [
                    {
                        operation: undefined,
                        parameterType: ParameterType.edge,
                        value: DeviceCapability.edge
                    }
                ],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: '',
            }
        )).toEqual(`${LIST_IOT_DEVICES} WHERE (${ParameterType.edge}=true)`);

        expect(utils.buildQueryString(
            {
                clauses: [
                    {
                        operation: undefined,
                        parameterType: ParameterType.status,
                        value: DeviceStatus.enabled
                    }
                ],
                continuationTokens: [],
                currentPageIndex: 1,
                deviceId: '',
            }
        )).toEqual(`${LIST_IOT_DEVICES} WHERE (${ParameterType.status}='enabled')`);
    });

    it('converts query object to string', () => {
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
            },
            {
                operation: OperationType.equals,
                parameterType: ParameterType.status,
                value: 'disabled'
            }
        ])).toEqual(`status='enabled' AND status='disabled'`);
    });

    it('creates clause item as string', () => {
        expect(utils.clauseItemToString('foo', OperationType.equals, 'bar')).toEqual(`foo = 'bar'`);
        expect(utils.clauseItemToString('foo', OperationType.notEquals, 'bar')).toEqual(`foo != 'bar'`);
    });

    it('handles escaping strings appropriately', () => {
        expect(utils.escapeValue('1')).toEqual('1');
        expect(utils.escapeValue(`'enabled'`)).toEqual(`'enabled'`);
        expect(utils.escapeValue('enabled')).toEqual(`'enabled'`);
        expect(utils.escapeValue(`o'really`)).toEqual(`'o'really'`);
    });

    it('gets connectionObject from hub connection string', () => {
        const connectionObject = utils.getConnectionInfoFromConnectionString('HostName=test.azure-devices-int.net;SharedAccessKeyName=iothubowner;SharedAccessKey=key');
        expect(connectionObject.hostName = 'test.azure-devices-int.net');
        expect(connectionObject.sharedAccessKeyName = 'iothubowner');
        expect(connectionObject.sharedAccessKey = 'key');
    });

    it('generates hub sas token ', () => {
        const token = utils.generateSasToken({
            key: 'key',
            keyName: 'iothubowner',
            resourceUri: 'test.azureiotrepository.com'
        });
        const regex = new RegExp(/^SharedAccessSignature sr=test\.azureiotrepository\.com&sig=.*&se=.*&skn=iothubowner$/);
        expect(regex.test(token)).toBeTruthy();
    });
});
