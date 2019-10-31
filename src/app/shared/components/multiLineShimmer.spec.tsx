/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import MultiLineShimmer from './multiLineShimmer';
import { mountWithLocalization } from '../utils/testHelpers';

describe('shared/components/multiLineShimmer', () => {
    it('renders shimmers properly', () => {
        let wrapper = mountWithLocalization(<MultiLineShimmer/>).find(MultiLineShimmer);
        let shimmerDiv = wrapper.find('div.fixed-shimmer');
        // tslint:disable-next-line:no-magic-numbers
        expect(shimmerDiv.find(Shimmer)).toHaveLength(3);

        const shimmerCount = 10;
        wrapper = mountWithLocalization(<MultiLineShimmer className="non-fixed-shimmer" shimmerCount={shimmerCount}/>).find(MultiLineShimmer);
        shimmerDiv = wrapper.find('div.non-fixed-shimmer');
        expect(shimmerDiv.find(Shimmer)).toHaveLength(shimmerCount);
    });
});
