/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { RadioGroup } from '@fluentui/react-components';
import { PasswordField } from '../../../../shared/components/passwordField';
import { AddModuleIdentity } from './addModuleIdentity';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import { addModuleIdentityAction } from '../actions';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';

const pathname = `/`;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname, search: '' })
}));

describe('devices/components/addModuleIdentity', () => {
    beforeEach(() => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([{synchronizationStatus: SynchronizationStatus.initialized}, jest.fn()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            expect(shallow(<AddModuleIdentity/>)).toMatchSnapshot();
        });

        it('calls add', () => {
            const addModuleIdentityActionSpy = jest.spyOn(addModuleIdentityAction, 'started');
            const wrapper = mount(<AddModuleIdentity/>);
            const commandBar = wrapper.find(CommandBar).first();
            act(() => commandBar.props().items[0].onClick(null));

            expect(addModuleIdentityActionSpy).toBeCalled();
        });

        it('renders symmetric key input field if not auto generating keys', () => {
            const wrapper = mount(<AddModuleIdentity/>);
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
            expect(fields.at(0).props().errorMessage).toEqual('moduleIdentity.validation.invalidKey');
            expect(fields.at(1).props().value).toEqual('test-key2');
            expect(fields.at(1).props().errorMessage).toEqual('moduleIdentity.validation.invalidKey');
        });

        it('renders selfSigned input field', () => {
            const wrapper = mount(<AddModuleIdentity/>);

            const radioGroup = wrapper.find(RadioGroup).first();
            act(() => radioGroup.props().onChange?.(undefined as any, { value: DeviceAuthenticationType.SelfSigned } ));
            wrapper.update();
            expect(wrapper.find(PasswordField).length).toEqual(2);  // tslint:disable-line:no-magic-numbers

            act(() => wrapper.find(PasswordField).at(0).props().onChange?.(undefined as any, {value: 'test-thumbprint1'}));
            act(() => wrapper.find(PasswordField).at(1).props().onChange?.(undefined as any, {value: 'test-thumbprint2'}));
            wrapper.update();
            const fields = wrapper.find(PasswordField);
            expect(fields.at(0).props().value).toEqual('test-thumbprint1');
            expect(fields.at(0).props().errorMessage).toEqual('moduleIdentity.validation.invalidThumbprint');
            expect(fields.at(1).props().value).toEqual('test-thumbprint2');
            expect(fields.at(1).props().errorMessage).toEqual('moduleIdentity.validation.invalidThumbprint');
        });
    });
});
