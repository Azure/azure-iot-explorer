/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { mount } from 'enzyme';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { Callout, IconButton } from '@fluentui/react';
import { LabelWithRichCallout } from './labelWithRichCallout';

describe('components/shared/labelWithRichCallout', () => {

    it('matches snapshot when tooltip specified', () => {
        const wrapper = mount(
            <LabelWithRichCallout
                calloutContent={<></>}
            >
                {'labelText'}
            </LabelWithRichCallout>
        );

        expect(wrapper).toMatchSnapshot();

        act(() => wrapper.find(IconButton).props().onClick(undefined));
        wrapper.update();
        const callout = wrapper.find(Callout);
        expect(callout).toBeDefined();

        act((() => callout.props().onDismiss(null)));
        wrapper.update();
        const updatedCallout = wrapper.find(Callout);
        expect(updatedCallout.length).toEqual(0);
    });
});
