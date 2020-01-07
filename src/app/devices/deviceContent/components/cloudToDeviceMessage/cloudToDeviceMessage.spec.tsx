/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import CloudToDeviceMessage, { CloudToDeviceMessageProps, CloudToDeviceMessageState, systemPropertyKeyNameMappings } from './cloudToDeviceMessage';
import { testSnapshot, mountWithLocalization } from '../../../../shared/utils/testHelpers';

describe('cloudToDeviceMessage', () => {
    const mockSendCloudToDeviceMessage = jest.fn();
    const cloudToDeviceMessageProps: CloudToDeviceMessageProps = {
        onSendCloudToDeviceMessage: mockSendCloudToDeviceMessage
    };

    const routerprops: any = { // tslint:disable-line:no-any
        history: {
            location
        },
        location,
        match: {}
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...cloudToDeviceMessageProps,
            ...routerprops,
            ...overrides
        };

        return <CloudToDeviceMessage {...props} />;
    };

    it('matches snapshot', () => {
        const component = getComponent({
            settingSchema: undefined
        });
        testSnapshot(component);
    });

    it('sets message body', () => {
        const wrapper = mountWithLocalization(getComponent());
        const bodyTextField = wrapper.find(TextField).first();
        bodyTextField.instance().props.onChange({ target: null}, 'hello world');
        wrapper.update();
        expect((wrapper.state() as CloudToDeviceMessageState).body).toEqual('hello world');
    });

    it('sets timestamp', () => {
        const wrapper = mountWithLocalization(getComponent());
        const checkbox = wrapper.find(Checkbox).first();
        checkbox.instance().props.onChange({ target: null}, true);
        wrapper.update();
        expect((wrapper.state() as CloudToDeviceMessageState).addTimestamp).toEqual(true);
    });

    it('adds custom properties', () => {
        const wrapper = mountWithLocalization(getComponent());
        const commandBar = wrapper.find(CommandBar).at(1);
        // click the add custom property, which would add an entry to the editable grid
        commandBar.props().items[0].onClick(null);

        wrapper.update();
        expect((wrapper.state() as CloudToDeviceMessageState).properties.length).toEqual(2); // tslint:disable-line:no-magic-numbers

        const keyInput = wrapper.find(TextField).at(1);
        keyInput.instance().props.onChange({ target: null}, 'foo');
        const valueInput = wrapper.find(TextField).at(2); // tslint:disable-line:no-magic-numbers
        valueInput.instance().props.onChange({ target: null}, 'bar');

        wrapper.update();
        expect((wrapper.state() as CloudToDeviceMessageState).properties.some(property => property.keyName === 'foo' && !property.isSystemProperty && property.value === 'bar')).toEqual(true);
    });

    it('adds system properties', () => {
        const wrapper = mountWithLocalization(getComponent());
        const commandBar = wrapper.find(CommandBar).at(1);
        // click the add system property, which would add an entry to the editable grid
        commandBar.props().items[1].subMenuProps.items[0].onClick();

        wrapper.update();
        expect((wrapper.state() as CloudToDeviceMessageState).properties.length).toEqual(2); // tslint:disable-line:no-magic-numbers
        const ackDropDown = wrapper.find(Dropdown).first();
        ackDropDown.props().onChange(null, {key: 'full'} as any); // tslint:disable-line:no-any
        wrapper.update();
        expect((wrapper.state() as CloudToDeviceMessageState).properties.some(property => property.keyName === 'ack' && property.isSystemProperty && property.value === 'full')).toEqual(true);
    });

    it('disables send message button where there is duplicate keys', () => {
        const wrapper = mountWithLocalization(getComponent());
        // update state and intentionally create duplicated keys
        wrapper.setState({properties: [{index: 0, keyName: 'key', isSystemProperty: false, value: 'value1'}, {index: 0, keyName: 'key', isSystemProperty: false, value: 'value2'}]});
        wrapper.update();
        const commandBar = wrapper.find(CommandBar).first();
        expect(commandBar.props().items[0].disabled).toBeTruthy();
    });

    it('disables system property button when all the system properties keys have been added', () => {
        const wrapper = mountWithLocalization(getComponent());
        const properties = systemPropertyKeyNameMappings.map(keyNameMapping => ({
            index: 0, isSystemProperty: false, keyName: keyNameMapping.keyName, value: 'value'
        }));
        wrapper.setState({properties});
        wrapper.update();
        const commandBar = wrapper.find(CommandBar).get(1);
        expect(commandBar.props.items[1].subMenuProps.items.length).toEqual(systemPropertyKeyNameMappings.length);
        for (const item of commandBar.props.items[1].subMenuProps.items) {
            expect(item.disabled).toBeTruthy();
        }
    });

    it('dispatch action when send button is clicked', () => {
        const wrapper = mountWithLocalization(getComponent());
        const commandBar = wrapper.find(CommandBar).first();
        commandBar.props().items[0].onClick(null);
        wrapper.setState({properties: [{keyName: 'foo', value: 'bar'}]});
        wrapper.update();
        expect(mockSendCloudToDeviceMessage).toBeCalled();
    });
});
