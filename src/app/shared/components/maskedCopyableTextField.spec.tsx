/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import 'jest';
import { shallow, mount } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { MaskedCopyableTextField } from './maskedCopyableTextField';

describe('MaskedCopyableTextField', () => {
    describe('snapshots', () => {
        it('it matches snapshot when allowMask = false', () => {
            expect(shallow(
                <MaskedCopyableTextField
                    allowMask={false}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                    onTextChange={jest.fn()}
                    readOnly={true}
                    addNotification={jest.fn()}
                />
            )).toMatchSnapshot();
        });

        it('it matches snapshot when allowMask = true', () => {
            expect(shallow(
                <MaskedCopyableTextField
                    allowMask={true}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                    onTextChange={jest.fn()}
                    readOnly={true}
                    addNotification={jest.fn()}
                />
            )).toMatchSnapshot();
        });

        it('it matches snapshot when allowMask = true', () => {
            expect(shallow(
                <MaskedCopyableTextField
                    allowMask={true}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                    onTextChange={jest.fn()}
                    readOnly={true}
                    addNotification={jest.fn()}
                />
            )).toMatchSnapshot();
        });

        it('it matches snapshot when error message specified', () => {
            expect(shallow(
                <MaskedCopyableTextField
                    allowMask={true}
                    ariaLabel="ariaLabel1"
                    error="error"
                    label="label1"
                    value="value1"
                    onTextChange={jest.fn()}
                    readOnly={true}
                    addNotification={jest.fn()}
                />
            )).toMatchSnapshot();
        });
    });

    describe('toggleDisplay', () => {
        it('toggles display on toggleDisplay click', () => {
            const wrapper = mount(
                <MaskedCopyableTextField
                    allowMask={true}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                    onTextChange={jest.fn()}
                    readOnly={true}
                    addNotification={jest.fn()}
                />);

            expect(wrapper.find(TooltipHost).first().props().content).toEqual('common.maskedCopyableTextField.toggleMask.label.show');
            const showButton = wrapper.find(IconButton).first();
            act(() =>showButton.props().onClick(undefined));

            wrapper.update();
            expect(wrapper.find(TooltipHost).first().props().content).toEqual('common.maskedCopyableTextField.toggleMask.label.hide');
        });
    });

    describe('copyToClipboard', () => {
        it('executes copyToClipboard', async done => {
            const wrapper = mount(
                <MaskedCopyableTextField
                    allowMask={false}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                    onTextChange={jest.fn()}
                    readOnly={true}
                    addNotification={jest.fn()}
                />);

            const clipboardButton = wrapper.find(IconButton).first();
            clipboardButton.props().onClick(undefined);

            expect(document.execCommand).toHaveBeenLastCalledWith('copy');
            done();
        });
    });

    describe('change to input', () => {
        it('call onTextChange prop', () => {
            const onTextChange = jest.fn();
            const wrapper = mount(
                <MaskedCopyableTextField
                    allowMask={false}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                    onTextChange={onTextChange}
                    readOnly={true}
                    addNotification={jest.fn()}
                />);

            const input = wrapper.find('input').first();
            input.simulate('change', { target: { value: 'hello world' } });

            expect(onTextChange).toHaveBeenCalledTimes(1);
        });
    });
});
