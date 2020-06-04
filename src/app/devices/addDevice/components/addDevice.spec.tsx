/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { AddDevice } from './addDevice';
import { MaskedCopyableTextField } from '../../../shared/components/maskedCopyableTextField';
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
        expect(wrapper.find(MaskedCopyableTextField).length).toEqual(1);

        // uncheck auto generate
        const autoGenerateButton = wrapper.find('.autoGenerateButton').first();
        act(() => autoGenerateButton.props().onChange(undefined));
        wrapper.update();
        expect(wrapper.find(MaskedCopyableTextField).length).toEqual(3); // tslint:disable-line:no-magic-numbers

        act(() => wrapper.find(MaskedCopyableTextField).at(1).props().onTextChange('test-key1'));
        act(() => wrapper.find(MaskedCopyableTextField).at(2).props().onTextChange('test-key2')); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        const fields = wrapper.find(MaskedCopyableTextField);
        expect(fields.at(1).props().value).toEqual('test-key1');
        expect(fields.at(1).props().error).toEqual('deviceIdentity.validation.invalidKey');
        expect(fields.last().props().value).toEqual('test-key2');
        expect(fields.last().props().error).toEqual('deviceIdentity.validation.invalidKey');
    });

    it('renders selfSigned input field', () => {
        const wrapper = mount(<AddDevice/>);

        const choiceGroup = wrapper.find(ChoiceGroup).first();
        act(() => choiceGroup.props().onChange(undefined, { key: DeviceAuthenticationType.SelfSigned, text: 'text' } ));
        wrapper.update();
        expect(wrapper.find(MaskedCopyableTextField).length).toEqual(3);  // tslint:disable-line:no-magic-numbers

        act(() => wrapper.find(MaskedCopyableTextField).at(1).props().onTextChange('test-thumbprint1'));
        act(() => wrapper.find(MaskedCopyableTextField).last().props().onTextChange('test-thumbprint2'));
        wrapper.update();
        const fields = wrapper.find(MaskedCopyableTextField);
        expect(fields.at(1).props().value).toEqual('test-thumbprint1');
        expect(fields.at(1).props().error).toEqual('deviceIdentity.validation.invalidThumbprint');
        expect(fields.last().props().value).toEqual('test-thumbprint2');
        expect(fields.last().props().error).toEqual('deviceIdentity.validation.invalidThumbprint');
    });

    it('saves new device identity', () => {
        const addDeviceActionSpy = jest.spyOn(addDeviceAction, 'started');
        const wrapper = mount(<AddDevice/>);

        act(() => wrapper.find(MaskedCopyableTextField).first().props().onTextChange('test-device'));
        act(() => wrapper.find(Toggle).first().instance().props.onChange({ target: null}, false));
        wrapper.update();

        expect(wrapper.find(MaskedCopyableTextField).first().props().value).toEqual('test-device');
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
