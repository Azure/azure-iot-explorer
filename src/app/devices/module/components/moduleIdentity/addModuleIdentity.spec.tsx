/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/components/ChoiceGroup';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { AddModuleIdentityComponent, AddModuleIdentityDataProps, AddModuleIdentityDispatchProps, AddModuleIdentityState } from './addModuleIdentity';
import { mountWithStoreAndRouter } from '../../../../shared/utils/testHelpers';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';

const pathname = `/`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ pathname, search: '' })
}));

const moduleIdentityDataProps: AddModuleIdentityDataProps = {
    synchronizationStatus: SynchronizationStatus.working
};

const mockAddModuleIdentity = jest.fn();
const moduleIdentityDispatchProps: AddModuleIdentityDispatchProps = {
    addModuleIdentity: mockAddModuleIdentity
};

const getComponent = (overrides = {}) => {
    const props = {
        ...moduleIdentityDataProps,
        ...moduleIdentityDispatchProps,
        ...overrides
    };
    return <AddModuleIdentityComponent {...props} />;
};

describe('devices/components/addModuleIdentity', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            expect(shallow(getComponent())).toMatchSnapshot();
        });

        it('matches snapshot when add finishes', () => {
            expect(shallow(getComponent({
                synchronizationStatus: SynchronizationStatus.upserted
            }))).toMatchSnapshot();
        });

        it('calls add', () => {
            const wrapper = mountWithStoreAndRouter(getComponent(), true);
            const commandBar = wrapper.find(CommandBar).first();
            act(() => commandBar.props().items[0].onClick(null));
            expect(mockAddModuleIdentity).toBeCalled();
        });

        it('renders symmetric key input field if not auto generating keys', () => {
            const wrapper = mountWithStoreAndRouter(getComponent(), true);
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
            expect(fields.at(1).props().error).toEqual('moduleIdentity.validation.invalidKey');
            expect(fields.last().props().value).toEqual('test-key2');
            expect(fields.last().props().error).toEqual('moduleIdentity.validation.invalidKey');
        });

        it('renders selfSigned input field', () => {
            const wrapper = mountWithStoreAndRouter(getComponent(), true);

            const choiceGroup = wrapper.find(ChoiceGroup).first();
            act(() => choiceGroup.props().onChange(undefined, { key: DeviceAuthenticationType.SelfSigned, text: 'text' } ));
            wrapper.update();
            expect(wrapper.find(MaskedCopyableTextField).length).toEqual(3);  // tslint:disable-line:no-magic-numbers

            act(() => wrapper.find(MaskedCopyableTextField).at(1).props().onTextChange('test-thumbprint1'));
            act(() => wrapper.find(MaskedCopyableTextField).last().props().onTextChange('test-thumbprint2'));
            wrapper.update();
            const fields = wrapper.find(MaskedCopyableTextField);
            expect(fields.at(1).props().value).toEqual('test-thumbprint1');
            expect(fields.at(1).props().error).toEqual('moduleIdentity.validation.invalidThumbprint');
            expect(fields.last().props().value).toEqual('test-thumbprint2');
            expect(fields.last().props().error).toEqual('moduleIdentity.validation.invalidThumbprint');
        });
    });
});
