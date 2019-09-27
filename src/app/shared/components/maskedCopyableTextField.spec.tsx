/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow, mount } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { MaskedCopyableTextField, MaskedCopyableTextFieldState } from './maskedCopyableTextField';

describe('MaskedCopyableTextField', () => {
    describe('snapshots', () => {
        it('it matches snapshot when allowMask = false', () => {
            expect(shallow(
                <MaskedCopyableTextField
                    allowMask={false}
                    ariaLabel="ariaLabel1"
                    label="label1"
                    value="value1"
                    t={jest.fn((value: string) => value)}
                    onTextChange={jest.fn()}
                    readOnly={true}
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
                    t={jest.fn((value: string) => value)}
                    onTextChange={jest.fn()}
                    readOnly={true}
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
                    t={jest.fn((value: string) => value)}
                    onTextChange={jest.fn()}
                    readOnly={true}
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
                    t={jest.fn((value: string) => value)}
                    onTextChange={jest.fn()}
                    readOnly={true}
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
                    t={jest.fn((value: string) => value)}
                    onTextChange={jest.fn()}
                    readOnly={true}
                />);

            const showButton = wrapper.find(IconButton).first();
            showButton.props().onClick(undefined);

            const state = wrapper.state() as MaskedCopyableTextFieldState;
            expect(state.hideContents).toEqual(false);
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
                    t={jest.fn((value: string) => value)}
                    onTextChange={jest.fn()}
                    readOnly={true}
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
                    t={jest.fn((value: string) => value)}
                    onTextChange={onTextChange}
                    readOnly={true}
                />);

            const input = wrapper.find('input').first();
            input.simulate('change', { target: { value: 'hello world' } });

            expect(onTextChange).toHaveBeenCalledTimes(1);
        });
    });
});
