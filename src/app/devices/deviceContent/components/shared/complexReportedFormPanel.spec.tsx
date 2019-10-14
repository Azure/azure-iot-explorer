/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import ComplexReportedFormPanel, { ReportedFormDataProps , ReportedFormActionProps } from './complexReportedFormPanel';
import { testSnapshot } from '../../../../shared/utils/testHelpers';

describe('complexReportedFormPanel', () => {
    const formData = 123;
    const schema = {
        description: 'Brightness Level / The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
        title: 'brightness',
        type: 'number'
    };
    const modelDefinition = {
        '@type': 'Property',
        'description': 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
        'displayName': 'Brightness Level',
        'name': 'brightness',
        'schema': 'long',
        'writable': true
    };
    const deviceSettingsProps: ReportedFormDataProps = {
        formData,
        modelDefinition,
        schema,
        showPanel: false,
    };

    const deviceSettingsDispatchProps: ReportedFormActionProps = {
        handleDismiss: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceSettingsProps,
            ...deviceSettingsDispatchProps,
            ...overrides
        };

        return (<ComplexReportedFormPanel {...props} />);
    };

    it('matches snapshot without twinWithSchema', () => {
        testSnapshot(getComponent());
    });
});
