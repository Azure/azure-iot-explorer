/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
const InfiniteScroll = require('react-infinite-scroller'); // tslint:disable-line: no-var-requires
import { TextField } from 'office-ui-fabric-react/lib/components/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/components/Toggle';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { DeviceEvents } from './deviceEvents';
import { appConfig, HostMode } from '../../../../appConfig/appConfig';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { DEFAULT_CONSUMER_GROUP } from '../../../constants/apiConstants';
import { MILLISECONDS_IN_MINUTE } from '../../../constants/shared';

const pathname = `#/devices/detail/events/?id=device1`;
jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: `?id=device1`, pathname }),
}));

describe('components/devices/deviceEvents', () => {
    it('matches snapshot in electron', () => {
        appConfig.hostMode = HostMode.Electron;
        expect(shallow(<DeviceEvents/>)).toMatchSnapshot();
    });

    it('matches snapshot in hosted environment', () => {
        appConfig.hostMode = HostMode.Browser;
        expect(shallow(<DeviceEvents/>)).toMatchSnapshot();
    });

    it('changes state accordingly when command bar buttons are clicked', () => {
        const wrapper = mount(<DeviceEvents/>);
        const commandBar = wrapper.find(CommandBar).first();
        // click the start button
        act(() => commandBar.props().items[0].onClick(null));
        wrapper.update();
        expect(wrapper.find(InfiniteScroll).first().props().hasMore).toBeTruthy();

        // click the start button again which has been toggled to stop button
        act(() => wrapper.find(CommandBar).first().props().items[0].onClick(null));
        wrapper.update();
        expect(wrapper.find(InfiniteScroll).first().props().hasMore).toBeFalsy();

        // clear events button should be disabled
        expect(commandBar.props().items[1].disabled).toBeTruthy();

        // click the show system property button
        expect(commandBar.props().items[2].iconProps.iconName).toEqual('Checkbox');
        act(() => commandBar.props().items[2].onClick(null)); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        const updatedCommandBar = wrapper.find(CommandBar).first();
        expect(updatedCommandBar.props().items[2].iconProps.iconName).toEqual('CheckboxComposite');
    });

    it('changes state accordingly when consumer group value is changed', () => {
        const wrapper = mount(<DeviceEvents/>);
        const textField = wrapper.find(TextField).first();
        act(() => textField.instance().props.onChange({ target: null}, 'testGroup'));
        wrapper.update();
        expect(wrapper.find(TextField).first().props().value).toEqual('testGroup');
    });

    it('changes state accordingly when custom event hub boolean value is changed', () => {
        const wrapper = mount(<DeviceEvents/>);
        expect(wrapper.find('.custom-event-hub-text-field').length).toEqual(0);
        const toggle = wrapper.find(Toggle).at(0);
        act(() => toggle.instance().props.onChange({ target: null}, false));
        wrapper.update();
        expect(wrapper.find('.custom-event-hub-text-field').length).toEqual(6);
    });

    it('renders events', () => {
        const events = [{
            body: {
                humid: 123
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            properties: {
              'iothub-message-schema': 'humid'
            }
        }];

        const realUseState = React.useState;
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(DEFAULT_CONSUMER_GROUP));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(undefined));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(undefined));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(events));

        const wrapper = mount(<DeviceEvents/>);
        const enqueueTime = wrapper.find('h5');
        // tslint:disable-next-line:no-any
        expect((enqueueTime.props().children as any).join('')).toBeDefined();

        // click the clear events button
        expect(wrapper.find(InfiniteScroll).first().props().role).toEqual('feed');
        const commandBar = wrapper.find(CommandBar).first();
        act(() => commandBar.props().items[1].onClick(null));
        wrapper.update();
        expect(wrapper.find(InfiniteScroll).first().props().role).toEqual('main');
    });
});
