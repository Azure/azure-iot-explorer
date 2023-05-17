/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { ChoiceGroup, Toggle, CommandBar, TextField } from '@fluentui/react';
import { AddDevice } from './addDevice';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { addDeviceAction } from '../actions';

const pathname = '/devices/add';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
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
        expect(wrapper.find(TextField).length).toEqual(1);

        // uncheck auto generate
        const autoGenerateButton = wrapper.find('.autoGenerateButton').first();
        act(() => autoGenerateButton.props().onChange?.(undefined as any));
        wrapper.update();
        expect(wrapper.find(TextField).length).toEqual(3); // tslint:disable-line:no-magic-numbers

        act(() => wrapper.find(TextField).at(1).props().onChange?.(undefined as any, 'test-key1'));
        act(() => wrapper.find(TextField).at(2).props().onChange?.(undefined as any, 'test-key2')); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        const fields = wrapper.find(TextField);
        expect(fields.at(1).props().value).toEqual('test-key1');
        expect(fields.at(1).props().errorMessage).toEqual('deviceIdentity.validation.invalidKey');
        expect(fields.last().props().value).toEqual('test-key2');
        expect(fields.last().props().errorMessage).toEqual('deviceIdentity.validation.invalidKey');
    });

    it('renders selfSigned input field', () => {
        const wrapper = mount(<AddDevice/>);

        const choiceGroup = wrapper.find(ChoiceGroup).first();
        act(() => choiceGroup.props().onChange?.(undefined as any, { key: DeviceAuthenticationType.SelfSigned, text: 'text' } ));
        wrapper.update();
        expect(wrapper.find(TextField).length).toEqual(3);  // tslint:disable-line:no-magic-numbers

        act(() => wrapper.find(TextField).at(1).props().onChange?.(undefined as any, 'test-thumbprint1'));
        act(() => wrapper.find(TextField).last().props().onChange?.(undefined as any, 'test-thumbprint2'));
        wrapper.update();
        const fields = wrapper.find(TextField);
        expect(fields.at(1).props().value).toEqual('test-thumbprint1');
        expect(fields.at(1).props().errorMessage).toEqual('deviceIdentity.validation.invalidThumbprint');
        expect(fields.last().props().value).toEqual('test-thumbprint2');
        expect(fields.last().props().errorMessage).toEqual('deviceIdentity.validation.invalidThumbprint');
    });

    it('saves new device identity', () => {
        const addDeviceActionSpy = jest.spyOn(addDeviceAction, 'started');
        const wrapper = mount(<AddDevice/>);

        act(() => wrapper.find(TextField).first().props().onChange?.(undefined as any, 'test-device'));
        act(() => wrapper.find(Toggle).first().props().onChange?.(undefined as any, false));
        wrapper.update();

        expect(wrapper.find(TextField).first().props().value).toEqual('test-device');
        const toggle = wrapper.find('.connectivity').find(Toggle).first();
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
