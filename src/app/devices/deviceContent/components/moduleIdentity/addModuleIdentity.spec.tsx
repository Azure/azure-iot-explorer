/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import AddModuleIdentityComponent, { AddModuleIdentityDataProps, AddModuleIdentityDispatchProps, AddModuleIdentityState } from './addModuleIdentity';
import { mountWithLocalization, testSnapshot } from '../../../../shared/utils/testHelpers';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';

const pathname = `/`;

const location: any = { // tslint:disable-line:no-any
    pathname
};
const routerprops: any = { // tslint:disable-line:no-any
    history: {
        location
    },
    location,
    match: {}
};

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
        ...routerprops,
        ...overrides
    };
    return <AddModuleIdentityComponent {...props} />;
};

describe('devices/components/addModuleIdentity', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            testSnapshot(getComponent());
        });

        it('matches snapshot when add finishes', () => {
            testSnapshot(getComponent({
                synchronizationStatus: SynchronizationStatus.upserted
            }));
        });

        it('calls add', () => {
            const wrapper = mountWithLocalization(getComponent(), true);
            const commandBar = wrapper.find(CommandBar).first();
            commandBar.props().items[0].onClick(null);
            expect(mockAddModuleIdentity).toBeCalled();
        });

        it('renders symmetric key input field if not auto generating keys', () => {
            const component = getComponent();
            const wrapper = mountWithLocalization(component, true, true);

            let addModuleIdentity = wrapper.find(AddModuleIdentityComponent);
            addModuleIdentity.setState({autoGenerateKeys : false});
            wrapper.update();
            expect(wrapper.find(MaskedCopyableTextField).length).toEqual(3); // tslint:disable-line:no-magic-numbers

            wrapper.find(MaskedCopyableTextField).at(1).props().onTextChange('test-key1');
            wrapper.find(MaskedCopyableTextField).at(2).props().onTextChange('test-key2'); // tslint:disable-line:no-magic-numbers
            wrapper.update();
            addModuleIdentity = wrapper.find(AddModuleIdentityComponent);
            let addModuleIdentityState = addModuleIdentity.state() as AddModuleIdentityState;
            expect(addModuleIdentityState.primaryKey).toEqual('test-key1');
            expect(addModuleIdentityState.primaryKeyError).toEqual('moduleIdentity.validation.invalidKey');
            expect(addModuleIdentityState.secondaryKey).toEqual('test-key2');
            expect(addModuleIdentityState.secondaryKeyError).toEqual('moduleIdentity.validation.invalidKey');

            // auto generate
            const checkbox = addModuleIdentity.find(Checkbox);
            checkbox.instance().props.onChange({ target: null}, true);
            addModuleIdentity = wrapper.find(AddModuleIdentityComponent);
            addModuleIdentityState = addModuleIdentity.state() as AddModuleIdentityState;
            expect(addModuleIdentityState.primaryKey).toEqual(undefined);
            expect(addModuleIdentityState.secondaryKey).toEqual(undefined);
        });

        it('renders selfSigned input field', () => {
            const component = getComponent();
            const wrapper = mountWithLocalization(component, true, true);

            let addModuleIdentity = wrapper.find(AddModuleIdentityComponent);
            addModuleIdentity.setState({authenticationType: DeviceAuthenticationType.SelfSigned});
            wrapper.update();
            expect(wrapper.find(MaskedCopyableTextField).length).toEqual(3);  // tslint:disable-line:no-magic-numbers

            wrapper.find(MaskedCopyableTextField).at(1).props().onTextChange('test-thumbprint1');
            wrapper.find(MaskedCopyableTextField).at(2).props().onTextChange('test-thumbprint2'); // tslint:disable-line:no-magic-numbers
            wrapper.update();
            addModuleIdentity = wrapper.find(AddModuleIdentityComponent);
            const addModuleIdentityState = addModuleIdentity.state() as AddModuleIdentityState;
            expect(addModuleIdentityState.primaryThumbprint).toEqual('test-thumbprint1');
            expect(addModuleIdentityState.primaryThumbprintError).toEqual('moduleIdentity.validation.invalidThumbprint');
            expect(addModuleIdentityState.secondaryThumbprint).toEqual('test-thumbprint2');
            expect(addModuleIdentityState.secondaryThumbprintError).toEqual('moduleIdentity.validation.invalidThumbprint');
        });
    });
});
