/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { AddDevice, AddDeviceDataProps, AddDeviceActionProps } from './addDevice';
import { MaskedCopyableTextField } from '../../../../../shared/components/maskedCopyableTextField';
import { SynchronizationStatus } from '../../../../../api/models/synchronizationStatus';
import { DeviceAuthenticationType } from '../../../../../api/models/deviceAuthenticationType';
import { DeviceStatus } from '../../../../../api/models/deviceStatus';
import { mountWithStoreAndRouter } from '../../../../../shared/utils/testHelpers';

const pathname = '/devices/add';
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ pathname })
}));

describe('components/devices/addDevice', () => {
    const addDeviceDataProps: AddDeviceDataProps = {
        deviceListSyncStatus: SynchronizationStatus.fetched
    };

    const mockSaveDevice = jest.fn();
    const addDeviceDispatchProps: AddDeviceActionProps = {
        handleSave: mockSaveDevice
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...addDeviceDataProps,
            ...addDeviceDispatchProps,
            ...overrides
        };

        return (
            <AddDevice {...props} />
        );
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });

    it('renders symmetric key input field if not auto generating keys', () => {
        const wrapper = mountWithStoreAndRouter(getComponent(), true);

        const autoGenerateButton = wrapper.find('.autoGenerateButton').first();
        autoGenerateButton.simulate('click');
        wrapper.update();
        expect(wrapper.find(MaskedCopyableTextField).length).toEqual(3); // tslint:disable-line:no-magic-numbers

        act(() => wrapper.find(MaskedCopyableTextField).at(1).props().onTextChange('test-key1'));
        act(() => wrapper.find(MaskedCopyableTextField).at(2).props().onTextChange('test-key2')); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        const fields = wrapper.find(MaskedCopyableTextField);
        expect(fields).toEqual(1);

        // expect(wrapper.f.primaryKey).toEqual('test-key1');
        // expect(addDeviceState.primaryKeyError).toEqual('deviceIdentity.validation.invalidKey');
        // expect(addDeviceState.secondaryKey).toEqual('test-key2');
        // expect(addDeviceState.secondaryKeyError).toEqual('deviceIdentity.validation.invalidKey');

        // auto generate
        // const checkbox = addDevice.find(Checkbox);
        // checkbox.instance().props.onChange({ target: null}, true);
        // addDevice = wrapper.find(AddDeviceComponent);
        // addDeviceState = addDevice.state() as AddDeviceState;
        // expect(addDeviceState.primaryKey).toEqual(undefined);
        // expect(addDeviceState.secondaryKey).toEqual(undefined);
    });

    it('renders selfSigned input field', () => {
        const component = getComponent();
        const wrapper = mountWithLocalization(component, true, true);

        let addDevice = wrapper.find(AddDeviceComponent);
        addDevice.setState({authenticationType : DeviceAuthenticationType.SelfSigned});
        wrapper.update();
        expect(wrapper.find(MaskedCopyableTextField).length).toEqual(3);  // tslint:disable-line:no-magic-numbers

        wrapper.find(MaskedCopyableTextField).at(1).props().onTextChange('test-thumbprint1');
        wrapper.find(MaskedCopyableTextField).at(2).props().onTextChange('test-thumbprint2'); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        addDevice = wrapper.find(AddDeviceComponent);
        const addDeviceState = addDevice.state() as AddDeviceState;
        expect(addDeviceState.primaryThumbprint).toEqual('test-thumbprint1');
        expect(addDeviceState.primaryThumbprintError).toEqual('deviceIdentity.validation.invalidThumbprint');
        expect(addDeviceState.secondaryThumbprint).toEqual('test-thumbprint2');
        expect(addDeviceState.secondaryThumbprintError).toEqual('deviceIdentity.validation.invalidThumbprint');
    });

    it('saves new device identity', () => {
        const component = getComponent();
        const wrapper = mountWithLocalization(component, true, true);

        wrapper.find(MaskedCopyableTextField).first().props().onTextChange('test-device');
        wrapper.find(Toggle).first().instance().props.onChange({ target: null}, false);
        wrapper.update();
        const addDevice = wrapper.find(AddDeviceComponent);
        const addDeviceState = addDevice.state() as AddDeviceState;
        expect(addDeviceState.deviceId).toEqual('test-device');
        expect(addDeviceState.status).toEqual(DeviceStatus.Disabled);
        const commandBar = wrapper.find(CommandBar).first();
        const saveButton = commandBar.props().items[0];
        expect(saveButton.disabled).toBeFalsy();

        const form = addDevice.find('form');
        form.simulate('submit');
        expect(mockSaveDevice).toBeCalled();
    });
});
