/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import DeviceEventsComponent, { DeviceEventsState } from './deviceEvents';
import { mountWithLocalization, testSnapshot } from '../../../../shared/utils/testHelpers';

describe('components/devices/deviceEvents', () => {

    const pathname = `#/devices/detail/events/?id=device1`;

    const location: any = { // tslint:disable-line:no-any
        pathname
    };

    const routerProps: any = { // tslint:disable-line:no-any
        history: {
            location
        },
        location,
        match: {}
    };

    const getComponent = (overrides = {}) => {
        const props = {
            connectionString: '',
            ...routerProps,
            ...overrides,
        };
        return (<DeviceEventsComponent {...props} />);
    };

    it('matches snapshot', () => {
        const wrapper = getComponent();
        testSnapshot(wrapper);
    });

    it('changes state accordingly when command bar buttons are clicked', () => {
        const wrapper = mountWithLocalization(getComponent());
        const commandBar = wrapper.find(CommandBar).first();
        // click the start button
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).hasMore).toBeTruthy();

        // click the start button again which has been toggled to stop button
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).hasMore).toBeFalsy();

        // clear events button should be disabled
        expect(commandBar.props().items[1].disabled).toBeTruthy();

        // click the show system property button
        commandBar.props().items[2].onClick(null); // tslint:disable-line:no-magic-numbers
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).showSystemProperties).toBeTruthy();
    });

    it('changes state accordingly when consumer group value is changed', () => {
        const wrapper = mountWithLocalization(getComponent());
        const textField = wrapper.find(TextField).first();
        textField.instance().props.onChange({ target: null}, 'testGroup');
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).consumerGroup).toEqual('testGroup');
    });

    it('renders events', () => {
        const wrapper = mountWithLocalization(getComponent());
        const events = [{
            body: {
                humid: 123
            },
            enqueuedTime: '2019-10-14T21:44:58.397Z',
            properties: {
              'iothub-message-schema': 'humid'
            }
        }];
        wrapper.setState({events});
        wrapper.update();
        const enqueueTime = wrapper.find('h5');
        // tslint:disable-next-line:no-any
        expect((enqueueTime.props().children as any).join('')).toBeDefined();

        // click the clear events button
        const commandBar = wrapper.find(CommandBar).first();
        commandBar.props().items[1].onClick(null);
        wrapper.update();
        expect((wrapper.state() as DeviceEventsState).events).toEqual([]);
    });
});
