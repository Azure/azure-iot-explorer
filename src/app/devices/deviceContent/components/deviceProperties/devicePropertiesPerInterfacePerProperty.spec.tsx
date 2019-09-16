/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import DevicePropertiesPerInterfacePerProperty from './devicePropertiesPerInterfacePerProperty';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';

describe('components/devices/devicePropertiesPerInterfacePerProperty', () => {

    const name = 'state';
    const description = 'The state of the device. Two states online/offline are available.';
    const displayName = 'Device State';

    it('matches snapshot when there is a non-writable property of simple type', () => {
        const schema = 'boolean';
        const propertyModelDefinition = {
            '@type': 'Property',
            'description': description,
            'displayName': displayName,
            'name': name,
            'schema': schema
        };
        const propertySchema = {
            default: false,
            description: 'Device State / The state of the device. Two states online/offline are available.',
            title: name,
            type: schema
        };

        const wrapper = mountWithLocalization(
            <DevicePropertiesPerInterfacePerProperty
                propertyModelDefinition={propertyModelDefinition}
                propertySchema={propertySchema}
                reportedTwin={true}
                handleOverlayToggle={jest.fn()}
            />
        );

        expect(wrapper).toMatchSnapshot();

        const nameLabel = wrapper.find(Label).first();
        expect((nameLabel.props().children as any).join('')).toEqual(`${name} (${displayName} / ${description})`);  // tslint:disable-line:no-any

        const schemaLabel = wrapper.find(Label).at(1);
        expect(schemaLabel.props().children).toEqual(schema);

        const unitLabel = wrapper.find(Label).at(2); // tslint:disable-line:no-magic-numbers
        expect(unitLabel.props().children).toEqual('--');

        const valueLabel = wrapper.find(Label).at(3); // tslint:disable-line:no-magic-numbers
        expect(valueLabel.props().children).toEqual('true');
    });

    it('renders button to open complex details when there is a non-writable property of complex type', () => {
        const schema = 'Object';
        const reportedTwin = {
            test: 'value'
        };
        const propertyModelDefinition = {
            '@type': 'Property',
            'description': description,
            'displayName': displayName,
            'name': name,
            'schema': {
                '@type': schema,
                'fields': []
            }
        };
        const propertySchema = {
            default: false,
            description: 'Device State / The state of the device. Two states online/offline are available.',
            title: 'state',
            type: schema
        };

        const handleOverlayToggle = jest.fn();
        const wrapper = mountWithLocalization(
            <DevicePropertiesPerInterfacePerProperty
                propertyModelDefinition={propertyModelDefinition}
                propertySchema={propertySchema}
                reportedTwin={reportedTwin}
                handleOverlayToggle={handleOverlayToggle}
            />
        );

        const nameLabel = wrapper.find(Label).first();
        expect((nameLabel.props().children as any).join('')).toEqual(`${name} (${displayName} / ${description})`);  // tslint:disable-line:no-any

        const schemaLabel = wrapper.find(Label).at(1);
        expect(schemaLabel.props().children).toEqual(schema);

        const unitLabel = wrapper.find(Label).at(2); // tslint:disable-line:no-magic-numbers
        expect(unitLabel.props().children).toEqual('--');

        const complexValueButton = wrapper.find(DefaultButton);
        expect(complexValueButton.props().className).toEqual('column-value-button');
        complexValueButton.props().onClick(null);
        expect(handleOverlayToggle).toBeCalled();
    });
});
