/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { Popover } from '@fluentui/react-components';
import { LabelWithRichCallout } from './labelWithRichCallout';

describe('components/shared/labelWithRichCallout', () => {

    it('matches snapshot', () => {
        const wrapper = shallow(
            <LabelWithRichCallout
                calloutContent={<></>}
            >
                {'labelText'}
            </LabelWithRichCallout>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('renders popover with callout content', () => {
        const wrapper = mount(
            <LabelWithRichCallout
                calloutContent={<></>}
            >
                {'labelText'}
            </LabelWithRichCallout>
        );

        const popover = wrapper.find(Popover);
        expect(popover).toBeDefined();
        expect(popover.length).toEqual(1);
    });
});
