/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Callout, IconButton } from 'office-ui-fabric-react';
import LabelWithRichCallout, { LabelWithRichCalloutState } from './labelWithRichCallout';

describe('components/shared/labelWithRichCallout', () => {

    it('matches snapshot when tooltip specified', () => {
        const wrapper = shallow(
            <LabelWithRichCallout
                calloutContent={<></>}
            >
                {'labelText'}
            </LabelWithRichCallout>
        );
        expect(wrapper).toMatchSnapshot();
        wrapper.find(IconButton).props().onMouseOver(null);
        expect((wrapper.state() as LabelWithRichCalloutState).showCallout).toBeTruthy();
        wrapper.find(Callout).props().onDismiss(null);
        expect((wrapper.state() as LabelWithRichCalloutState).showCallout).toBeFalsy();
    });
});
