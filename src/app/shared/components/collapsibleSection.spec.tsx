/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { CollapsibleSection, CollapsibleSectionProps } from './collapsibleSection';

describe('collapsibleSection', () => {

    const getComponent = (overrides = {}) => {
        const props: CollapsibleSectionProps = {
            children: <></>,
            expanded: false,
            label: 'Label',
            tooltipText: 'tooltip',
            ...overrides
        };

        return <CollapsibleSection {...props} />;
    };

    it('matches snapshot', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
    });

    it('toggles section', () => {
        const wrapper = mount(getComponent());
        const button = wrapper.find(IconButton).at(0);
        const iconButton = wrapper.find(IconButton).first();
        expect(wrapper.find(IconButton).first().props().title).toEqual('collapsibleSection.open');

        button.simulate('click');
        wrapper.update();
        expect(wrapper.find(IconButton).first().props().title).toEqual('collapsibleSection.close');
    });
});
