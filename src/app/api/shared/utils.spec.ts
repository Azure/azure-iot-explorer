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
                deviceId: '',
            }
        )).toEqual(`${LIST_PLUG_AND_PLAY_DEVICES} WHERE (HAS_CAPABILITYMODEL('enabled'))`);
        expect(utils.buildQueryString(
            {
                clauses: [],
                deviceId: 'device1',
            }
        )).toEqual(`${LIST_PLUG_AND_PLAY_DEVICES} WHERE (deviceId = 'device1')`);
        expect(utils.buildQueryString(
            {
                clauses: [],
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
                deviceId: '',
            }
        )).toEqual(`WHERE (HAS_CAPABILITYMODEL('enabled'))`);
        expect(utils.queryToString(
            {
                clauses: [],
                deviceId: 'device1',
            }
        )).toEqual(`WHERE (deviceId = 'device1')`);
        expect(utils.queryToString(
            {
                clauses: [],
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
});
