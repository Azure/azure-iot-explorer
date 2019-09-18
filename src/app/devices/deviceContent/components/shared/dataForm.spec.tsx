/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import Form from 'react-jsonschema-form';
import DataForm, { DataFormDataProps, DataFormActionProps } from './dataForm';
import { testSnapshot, mountWithLocalization } from '../../../../shared/utils/testHelpers';

describe('dataForm', () => {
    const formData = 123;
    const settingSchema = {
        description: 'Brightness Level / The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
        title: 'brightness',
        type: 'number'
    };

    const dataFormProps: DataFormDataProps = {
        buttonText: 'text',
        formData,
        interfaceName: 'testInterface',
        schema: 'integer',
        settingSchema
    };

    const dataFormDispatchProps: DataFormActionProps = {
        craftPayload: jest.fn(),
        handleSave: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...dataFormProps,
            ...dataFormDispatchProps,
            ...overrides
        };

        return <DataForm {...props} />;
    };

    it('matches snapshot with simple type', () => {
        testSnapshot(getComponent());
        const wrapper = mountWithLocalization(getComponent());
        expect(wrapper.find(Form)).toBeDefined();
    });

    it('matches snapshot with unsupported type', () => {
        const component = getComponent({
            settingSchema: undefined
        });
        testSnapshot(component);
        const wrapper = mountWithLocalization(getComponent());
        expect(wrapper.find('div.monaco-editor')).toBeDefined();
    });
});
