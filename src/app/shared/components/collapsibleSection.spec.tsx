/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { testSnapshot, mountWithLocalization } from '../utils/testHelpers';
import CollapsibleSection, { CollapsibleSectionProps, CollapsibleSectionState } from './collapsibleSection';

describe('collapsibleSection', () => {

    const getComponent = (overrides = {}) => {
        const props: CollapsibleSectionProps = {
            expanded: false,
            label: 'Label',
            tooltipText: 'tooltip',
            ...overrides
        };

        return <CollapsibleSection {...props} />;
    };

    it('matches snapshot', () => {
        const component = getComponent({});
        testSnapshot(component);
    });

    it('toggles section', () => {
        const wrapper = mountWithLocalization(getComponent());
        const button = wrapper.find(IconButton).at(0);
        button.simulate('click');
        wrapper.update();
        expect((wrapper.state() as CollapsibleSectionState).expanded).toBeTruthy();
    });
});
