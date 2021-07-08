/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import 'jest';
 import * as React from 'react';
 import { shallow, mount } from 'enzyme';
 import { Panel, ActionButton } from '@fluentui/react';
 import { act } from 'react-dom/test-utils';
 import { NotificationPane } from './notificationPane';

 describe('notificationPane', () => {
    it('matches snapshot', () => {
        expect(shallow(<NotificationPane/>)).toMatchSnapshot();
    });

    it('toggles visibility', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));
        const wrapper = mount(<NotificationPane/>);
        expect(wrapper.find(Panel).props().isOpen).toEqual(true);

        act(() => wrapper.find(ActionButton).first().props().onClick(null));
        wrapper.update()
        expect(wrapper.find(Panel).props().isOpen).toEqual(false);
    });
});
