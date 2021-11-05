/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Stack, ActionButton, IconButton, Label } from '@fluentui/react';
import { DeviceSettingsPerInterfacePerSetting, DeviceSettingDataProps, DeviceSettingDispatchProps } from './deviceSettingsPerInterfacePerSetting';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
import { DataForm } from '../../../shared/components/dataForm';
import { ResourceKeys } from '../../../../../localization/resourceKeys';

describe('deviceSettingsPerInterfacePerSetting', () => {
    const name = 'state';
    const description = 'The state of the device. Two states online/offline are available.';
    const displayName = 'Device State';
    const handleCollapseToggle = jest.fn();
    let schema = 'boolean';

    const propertyModelDefinition: PropertyContent = {
        '@type': 'Property',
        'description': description,
        'displayName': displayName,
        'name': name,
        'schema': schema
    };

    const propertySchema: ParsedJsonSchema = {
        default: false,
        description: 'Device State / The state of the device. Two states online/offline are available.',
        required: [],
        title: name,
        type: schema
    };

    const handleOverlayToggle = jest.fn();
    const deviceSettingDispatchProps: DeviceSettingDispatchProps = {
        handleCollapseToggle,
        handleOverlayToggle,
        patchTwin: jest.fn()
    };

    let deviceSettingDataProps: DeviceSettingDataProps = {
        collapsed: true,
        componentName: 'sensor',
        deviceId: 'deviceId',
        interfaceId: 'urn:interfaceId',
        reportedSection: {
            value: false
        },
        settingModelDefinition: propertyModelDefinition,
        settingSchema: propertySchema
    };

    it('renders when there is a writable property of simple type without sync status', () => {
        const props = {
            ...deviceSettingDataProps,
            ...deviceSettingDispatchProps
        };

        const wrapper = mount(
            <DeviceSettingsPerInterfacePerSetting {...props}/>
        );

        const nameLabel = wrapper.find(Label).first();
        expect((nameLabel.props().children as any).join('')).toEqual(`${name} (${displayName} / ${description})`);  // tslint:disable-line:no-any

        const schemaLabel = wrapper.find(Label).at(1);
        expect(schemaLabel.props().children).toEqual(schema);

        const valueLabel = wrapper.find(Label).at(3); // tslint:disable-line:no-magic-numbers
        expect(valueLabel.props().children).toEqual('{\"value\":false}');
    });

    it('renders when there is a writable property of complex type with sync status', () => {
        schema = 'Object';
        const twinValue = {
            test: 'value'
        };
        propertyModelDefinition.schema = {
            '@type': schema,
            'fields': []
        };
        propertySchema.type = schema;
        const ackCode = 200;
        const ackDescription = 'ackDescription';
        deviceSettingDataProps = {
            ...deviceSettingDataProps,
            collapsed: false,
            reportedSection: {
                value: twinValue,
                ac: ackCode,
                ad: ackDescription
            },
            desiredValue: twinValue,
            settingModelDefinition: propertyModelDefinition,
            settingSchema: propertySchema
        };

        const props = {
            ...deviceSettingDataProps,
            ...deviceSettingDispatchProps
        };

        const wrapper = mount(
            <DeviceSettingsPerInterfacePerSetting {...props}/>
        );

        const nameLabel = wrapper.find(Label).first();
        expect((nameLabel.props().children as any).join('')).toEqual(`${name} (${displayName} / ${description})`);  // tslint:disable-line:no-any

        const schemaLabel = wrapper.find(Label).at(1);
        expect(schemaLabel.props().children).toEqual(schema);

        const complexValueButton = wrapper.find(ActionButton).first();
        expect(complexValueButton.props().className).toEqual('column-value-button');
        act(() => complexValueButton.props().onClick(null));
        expect(handleOverlayToggle).toBeCalled();

        const reportedStatus = wrapper.find(Stack);
        expect(reportedStatus.props().children[1].props.children).toEqual(ResourceKeys.deviceSettings.ackStatus.code);
        const form = wrapper.find(DataForm);
        expect(form.props().formData).toEqual(twinValue);

        const toggleButtons = wrapper.find(IconButton);
        expect(toggleButtons.first().props().iconProps).toEqual({iconName: InterfaceDetailCard.CLOSE});

        const header = wrapper.find('header');
        act(() => header.props().onClick(null));
        expect(handleCollapseToggle).toBeCalled();
    });
});
