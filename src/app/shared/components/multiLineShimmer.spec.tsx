/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import { Shimmer } from 'office-ui-fabric-react/lib/components/Shimmer';
import { MultiLineShimmer } from './multiLineShimmer';

describe('shared/components/multiLineShimmer', () => {
    it('renders shimmers properly', () => {
        let wrapper = mount(<MultiLineShimmer/>).find(MultiLineShimmer);
        let shimmerDiv = wrapper.find('div.fixed-shimmer');
        // tslint:disable-next-line:no-magic-numbers
        expect(shimmerDiv.find(Shimmer)).toHaveLength(3);

        const shimmerCount = 10;
        wrapper = mount(<MultiLineShimmer className="non-fixed-shimmer" shimmerCount={shimmerCount}/>).find(MultiLineShimmer);
        shimmerDiv = wrapper.find('div.non-fixed-shimmer');
        expect(shimmerDiv.find(Shimmer)).toHaveLength(shimmerCount);
    });
});
