/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { DeviceContentTypePanel } from './deviceContentTypePanel';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';

describe('DeviceDecoderPanel', () => {
    it('matches snapshot with default json option', () => {
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [getInitialDeviceEventsState(), deviceEventsStateContext.getInitialDeviceEventsOps()]);
        expect(shallow(
            <DeviceContentTypePanel
                showContentTypePanel={true}
                onToggleContentTypePanel={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('matches snapshot with customize content type option', () => {
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [{...getInitialDeviceEventsState(), contentType: {isContentTypeCustomized: true}},
                deviceEventsStateContext.getInitialDeviceEventsOps()]);
        expect(shallow(
            <DeviceContentTypePanel
                showContentTypePanel={true}
                onToggleContentTypePanel={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('expect setDecoderInfo called when save is clicked with correct input', () => {
        const setDecoderInfo = jest.fn();
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [{...getInitialDeviceEventsState(), contentType: {isContentTypeCustomized: true, decoderProtoFile: new File([], '')}},
                {...deviceEventsStateContext.getInitialDeviceEventsOps(), setDecoderInfo}]);
        const wrapper = mount(
            <DeviceContentTypePanel
                showContentTypePanel={true}
                onToggleContentTypePanel={jest.fn()}
            />);
        const form = wrapper.find('form');
        form.simulate('submit');
        wrapper.update();
        expect(setDecoderInfo).toBeCalled();
    });
});
 