/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { ChoiceGroup, CommandBar, TextField } from '@fluentui/react';
import { AddModuleIdentity } from './addModuleIdentity';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import { addModuleIdentityAction } from '../actions';

const pathname = `/`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
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
            expect(fields.at(1).props().errorMessage).toEqual('moduleIdentity.validation.invalidKey');
            expect(fields.last().props().value).toEqual('test-key2');
            expect(fields.last().props().errorMessage).toEqual('moduleIdentity.validation.invalidKey');
        });

        it('renders selfSigned input field', () => {
            const wrapper = mount(<AddModuleIdentity/>);

            const choiceGroup = wrapper.find(ChoiceGroup).first();
            act(() => choiceGroup.props().onChange?.(undefined as any, { key: DeviceAuthenticationType.SelfSigned, text: 'text' } ));
            wrapper.update();
            expect(wrapper.find(TextField).length).toEqual(3);  // tslint:disable-line:no-magic-numbers

            act(() => wrapper.find(TextField).at(1).props().onChange?.(undefined as any, 'test-thumbprint1'));
            act(() => wrapper.find(TextField).last().props().onChange?.(undefined as any, 'test-thumbprint2'));
            wrapper.update();
            const fields = wrapper.find(TextField);
            expect(fields.at(1).props().value).toEqual('test-thumbprint1');
            expect(fields.at(1).props().errorMessage).toEqual('moduleIdentity.validation.invalidThumbprint');
            expect(fields.last().props().value).toEqual('test-thumbprint2');
            expect(fields.last().props().errorMessage).toEqual('moduleIdentity.validation.invalidThumbprint');
        });
    });
});
