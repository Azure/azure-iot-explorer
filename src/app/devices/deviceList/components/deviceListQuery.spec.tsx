/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DeviceListQuery from './deviceListQuery';
import { testWithLocalizationContext } from '../../../shared/utils/testHelpers';
import { ParameterType, OperationType } from '../../../api/models/deviceQuery';

describe('components/devices/DeviceListQuery', () => {
    it('matches snapshot for deviceId', () => {
        const wrapper = testWithLocalizationContext(
            <DeviceListQuery
                executeQuery={jest.fn()}
                query={{ deviceId: 'device1', clauses: [] }}
                setQuery={jest.fn()}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
    it('matches snapshot for clauses', () => {
        const wrapper = testWithLocalizationContext(
            <DeviceListQuery
                executeQuery={jest.fn()}
                query={{
                    clauses: [
                        {
                            operation: OperationType.equals,
                            parameterType: ParameterType.status,
                            value: 'enabled'
                        }],
                    deviceId: '',
                }}
                setQuery={jest.fn()}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
