/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { IconButton } from '@fluentui/react';
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
        moduleId: '',
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

        // Check that the collapse button is rendered
        const toggleButton = wrapper.find(IconButton);
        expect(toggleButton).toHaveLength(1);
        expect(toggleButton.props().iconProps).toEqual({iconName: InterfaceDetailCard.OPEN}); // collapsed by default

        // Check that the header is clickable for collapse/expand
        const header = wrapper.find('header');
        expect(header).toHaveLength(1);
        expect(header.props().onClick).toBe(handleCollapseToggle);

        // Check that form is not visible when collapsed
        const form = wrapper.find(DataForm);
        expect(form).toHaveLength(0);
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
            desiredValue: twinValue,
            reportedSection: {
                ac: ackCode,
                ad: ackDescription,
                value: twinValue
            },
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

        // Check that the collapse button shows close icon when expanded
        const toggleButton = wrapper.find(IconButton);
        expect(toggleButton).toHaveLength(1);
        expect(toggleButton.props().iconProps).toEqual({iconName: InterfaceDetailCard.CLOSE});

        // Check that the header is clickable for collapse/expand
        const header = wrapper.find('header');
        expect(header).toHaveLength(1);
        const onClickHandler = header.props().onClick;
        if (onClickHandler) {
            act(() => onClickHandler({} as React.MouseEvent<HTMLElement>));
        }
        expect(handleCollapseToggle).toBeCalled();

        // Check that form is visible when expanded
        const form = wrapper.find(DataForm);
        expect(form).toHaveLength(1);
        expect((form.props() as any).formData).toEqual(twinValue); // tslint:disable-line:no-any

        // Check that the component renders in expanded state
        const section = wrapper.find('section');
        expect(section).toHaveLength(1);
        expect(section.props().className).toEqual('item-detail item-detail-uncollapsed');
    });
});
