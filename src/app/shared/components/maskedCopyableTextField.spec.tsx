/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import 'jest';
import { shallow, mount } from 'enzyme';
import { IconButton, TooltipHost } from '@fluentui/react';
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
                />);

            expect(wrapper.find(TooltipHost).first().props().content).toEqual('common.maskedCopyableTextField.toggleMask.label.show');
            const showButton = wrapper.find(IconButton).first();
            act(() => showButton.props().onClick(undefined));

            wrapper.update();
            expect(wrapper.find(TooltipHost).first().props().content).toEqual('common.maskedCopyableTextField.toggleMask.label.hide');
        });
    });

    describe('copyToClipboard', () => {
        it('executes copyToClipboard', async () => {
            const wrapper = mount(
                <MaskedCopyableTextField
                    allowMask={false}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                />);

            const clipboardButton = wrapper.find(IconButton).first();
            act(() => clipboardButton.props().onClick(undefined));

            expect(document.execCommand).toHaveBeenLastCalledWith('copy');
        });
    });
});
