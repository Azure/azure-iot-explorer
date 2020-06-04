/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import { CloudToDeviceMessage, systemPropertyKeyNameMappings } from './cloudToDeviceMessage';
import { cloudToDeviceMessageAction } from '../actions';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: '?deviceId=testDevice' })
}));

describe('cloudToDeviceMessage', () => {
    beforeEach(() => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{}, jest.fn()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('matches snapshot', () => {
        expect(shallow(<CloudToDeviceMessage/>)).toMatchSnapshot();
    });

    it('sets message body', () => {
        const mockSendCloudToDeviceMessageSpy = jest.spyOn(cloudToDeviceMessageAction, 'started');
        const wrapper = mount(<CloudToDeviceMessage/>);
        const bodyTextField = wrapper.find(TextField).first();
        act(() => bodyTextField.instance().props.onChange({ target: null}, 'hello world'));
        wrapper.update();
        const commandBar = wrapper.find(CommandBar).first();
        act(() => commandBar.props().items[0].onClick());
        wrapper.update();
        expect(mockSendCloudToDeviceMessageSpy.mock.calls[0][0].body).toEqual('hello world');
    });

    it('sets timestamp', () => {
        const mockSendCloudToDeviceMessageSpy = jest.spyOn(cloudToDeviceMessageAction, 'started');
        const wrapper = mount(<CloudToDeviceMessage/>);
        const checkbox = wrapper.find(Checkbox).first();
        act(() => checkbox.instance().props.onChange({ target: null}, true));
        wrapper.update();
        const commandBar = wrapper.find(CommandBar).first();
        const currentTime = new Date().toLocaleString();
        act(() => commandBar.props().items[0].onClick());
        wrapper.update();
        expect(mockSendCloudToDeviceMessageSpy.mock.calls[0][0].body).toEqual(currentTime.toLocaleString());
    });

    it('adds custom properties', () => {
        const mockSendCloudToDeviceMessageSpy = jest.spyOn(cloudToDeviceMessageAction, 'started');
        const wrapper = mount(<CloudToDeviceMessage/>);
        const commandBar = wrapper.find(CommandBar).at(1);
        // click the add custom property, which would add an entry to the editable grid
        act(() => commandBar.props().items[0].onClick(null));

        wrapper.update();
        const keyInput = wrapper.find(TextField).at(1);
        act(() => keyInput.instance().props.onChange({ target: null}, 'foo'));
        const valueInput = wrapper.find(TextField).at(2); // tslint:disable-line:no-magic-numbers
        act(() => valueInput.instance().props.onChange({ target: null}, 'bar'));

        wrapper.update();
        const updatedCommandBar = wrapper.find(CommandBar).first();
        act(() => updatedCommandBar.props().items[0].onClick());
        wrapper.update();
        expect(mockSendCloudToDeviceMessageSpy.mock.calls[0][0].properties).toContainEqual({isSystemProperty: false, key: 'foo', value: 'bar' });
    });

    it('adds system properties', () => {
        const mockSendCloudToDeviceMessageSpy = jest.spyOn(cloudToDeviceMessageAction, 'started');
        const wrapper = mount(<CloudToDeviceMessage/>);
        const commandBar = wrapper.find(CommandBar).at(1);
        // click the add system property, which would add an entry to the editable grid
        act(() => commandBar.props().items[1].subMenuProps.items[0].onClick());

        wrapper.update();
        const ackDropDown = wrapper.find(Dropdown).first();
        act(() => ackDropDown.props().onChange(null, {key: 'full'} as any)); // tslint:disable-line:no-any
        wrapper.update();

        const updatedCommandBar = wrapper.find(CommandBar).first();
        act(() => updatedCommandBar.props().items[0].onClick());
        wrapper.update();
        expect(mockSendCloudToDeviceMessageSpy.mock.calls[0][0].properties).toContainEqual({ isSystemProperty: true, key: 'ack', value: 'full' });
    });

    it('disables send message button where there is duplicate keys', () => {
        const duplicateProperties = [{index: 0, keyName: 'key', isSystemProperty: false, value: 'value1'}, {index: 0, keyName: 'key', isSystemProperty: false, value: 'value2'}];
        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(duplicateProperties));

        const wrapper = mount(<CloudToDeviceMessage/>);
        wrapper.update();
        const commandBar = wrapper.find(CommandBar).first();
        expect(commandBar.props().items[0].disabled).toBeTruthy();
    });

    it('disables system property button when all the system properties keys have been added', () => {
        const properties = systemPropertyKeyNameMappings.map(keyNameMapping => ({
            index: 0, isSystemProperty: false, keyName: keyNameMapping.keyName, value: 'value'
        }));
        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(properties));

        const wrapper = mount(<CloudToDeviceMessage/>);
        const commandBar = wrapper.find(CommandBar).get(1);
        expect(commandBar.props.items[1].subMenuProps.items.length).toEqual(systemPropertyKeyNameMappings.length);
        for (const item of commandBar.props.items[1].subMenuProps.items) {
            expect(item.disabled).toBeTruthy();
        }
    });

    it('dispatch action when send button is clicked', () => {
        const mockSendCloudToDeviceMessageSpy = jest.spyOn(cloudToDeviceMessageAction, 'started');
        const wrapper = mount(<CloudToDeviceMessage/>);
        const commandBar = wrapper.find(CommandBar).first();

        act(() => commandBar.props().items[0].onClick());
        expect(mockSendCloudToDeviceMessageSpy).toBeCalled();
    });
});
