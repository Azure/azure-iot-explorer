/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Input, RadioGroup, Switch } from '@fluentui/react-components';
import { PasswordField } from '../../../shared/components/passwordField';
import { AddDevice } from './addDevice';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { addDeviceAction } from '../actions';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';

const pathname = '/devices/add';
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname })
}));

describe('addDevice', () => {
    beforeEach(() => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{synchronizationStatus: SynchronizationStatus.initialized}, jest.fn()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('matches snapshot', () => {
        expect(shallow(<AddDevice/>)).toMatchSnapshot();
    });

    it('renders symmetric key input field if not auto generating keys', () => {
        // auto generate
        const wrapper = mount(<AddDevice/>);
        expect(wrapper.find(PasswordField).length).toEqual(0);

        // uncheck auto generate
        const autoGenerateButton = wrapper.find('.autoGenerateButton').first();
        act(() => autoGenerateButton.props().onChange?.({target: {checked: false}} as any, {checked: false}));
        wrapper.update();
        expect(wrapper.find(PasswordField).length).toEqual(2); // tslint:disable-line:no-magic-numbers

        act(() => wrapper.find(PasswordField).at(0).props().onChange?.(undefined as any, {value: 'test-key1'}));
        act(() => wrapper.find(PasswordField).at(1).props().onChange?.(undefined as any, {value: 'test-key2'}));
        wrapper.update();
        const fields = wrapper.find(PasswordField);
        expect(fields.at(0).props().value).toEqual('test-key1');
        expect(fields.at(0).props().errorMessage).toEqual('deviceIdentity.validation.invalidKey');
        expect(fields.at(1).props().value).toEqual('test-key2');
        expect(fields.at(1).props().errorMessage).toEqual('deviceIdentity.validation.invalidKey');
    });

    it('renders selfSigned input field', () => {
        const wrapper = mount(<AddDevice/>);

        const radioGroup = wrapper.find(RadioGroup).first();
        act(() => radioGroup.props().onChange?.(undefined as any, { value: DeviceAuthenticationType.SelfSigned } ));
        wrapper.update();
        expect(wrapper.find(PasswordField).length).toEqual(2);  // tslint:disable-line:no-magic-numbers

        act(() => wrapper.find(PasswordField).at(0).props().onChange?.(undefined as any, {value: 'test-thumbprint1'}));
        act(() => wrapper.find(PasswordField).at(1).props().onChange?.(undefined as any, {value: 'test-thumbprint2'}));
        wrapper.update();
        const fields = wrapper.find(PasswordField);
        expect(fields.at(0).props().value).toEqual('test-thumbprint1');
        expect(fields.at(0).props().errorMessage).toEqual('deviceIdentity.validation.invalidThumbprint');
        expect(fields.at(1).props().value).toEqual('test-thumbprint2');
        expect(fields.at(1).props().errorMessage).toEqual('deviceIdentity.validation.invalidThumbprint');
    });

    it('saves new device identity', () => {
        const addDeviceActionSpy = jest.spyOn(addDeviceAction, 'started');
        const wrapper = mount(<AddDevice/>);

        act(() => wrapper.find(Input).first().props().onChange?.(undefined as any, {value: 'test-device'}));
        act(() => wrapper.find(Switch).first().props().onChange?.({target: {checked: false}} as any, {checked: false}));
        wrapper.update();

        expect(wrapper.find(Input).first().props().value).toEqual('test-device');
        const toggle = wrapper.find('.connectivity').find(Switch).first();
        expect(toggle.props().checked).toBeFalsy();
        const commandBar = wrapper.find(CommandBar).first();
        const saveButton = commandBar.props().items[0];
        expect(saveButton.disabled).toBeFalsy();

        const form = wrapper.find('form');
        form.simulate('submit');
        wrapper.update();
        expect(addDeviceActionSpy).toBeCalledWith({
            authentication: {
                symmetricKey: {
                    primaryKey: null,
                    secondaryKey: null
                },
                type: 'sas',
                x509Thumbprint:  null,
            },
            capabilities: {
                iotEdge: false
            },
            cloudToDeviceMessageCount: null,
            deviceId: 'test-device',
            etag: null,
            lastActivityTime: null,
            status: '',
            statusReason: null,
            statusUpdatedTime: null
        });
    });
});
