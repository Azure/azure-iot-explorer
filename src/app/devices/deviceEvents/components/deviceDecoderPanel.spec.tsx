/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { DeviceDecoderPanel } from './deviceDecoderPanel';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';
import { PrimaryButton } from '@fluentui/react';
import { act } from 'react-dom/test-utils';

describe('DeviceDecoderPanel', () => {
    it('matches snapshot with default json option', () => {
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [getInitialDeviceEventsState(), deviceEventsStateContext.getInitialDeviceEventsOps()]);
        expect(shallow(
            <DeviceDecoderPanel
                showDecoderPanel={true}
                onToggleDecoderPanel={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('matches snapshot with customize content type option', () => {
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [{...getInitialDeviceEventsState(), decoder: {isDecoderCustomized: true}},
                deviceEventsStateContext.getInitialDeviceEventsOps()]);
        expect(shallow(
            <DeviceDecoderPanel
                showDecoderPanel={true}
                onToggleDecoderPanel={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('expect setDecoderInfo called when save is clicked with correct input', () => {
        const setDecoderInfo = jest.fn();
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [{...getInitialDeviceEventsState(), decoder: {isDecoderCustomized: true, decoderProtoFile: new File([], '')}},
                {...deviceEventsStateContext.getInitialDeviceEventsOps(), setDecoderInfo}]);
        const wrapper = mount(
            <DeviceDecoderPanel
                showDecoderPanel={true}
                onToggleDecoderPanel={jest.fn()}
            />);
        const form = wrapper.find('form');
        form.simulate('submit');
        wrapper.update();
        expect(setDecoderInfo).toBeCalled();
    });
});
 