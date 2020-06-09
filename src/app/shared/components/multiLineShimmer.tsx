/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Shimmer, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import '../../css/_multilineShimmer.scss';

const SHIMMER_HEIGHT = 20;
const SHIMMER_COUNT = 3;

export interface MultiLineShimmerProps {
    className?: string ;
    shimmerCount?: number;
}

export const MultiLineShimmer = (props: MultiLineShimmerProps) => {
    const shimmerCount = props.shimmerCount || SHIMMER_COUNT;
    const className = props.className || 'fixed-shimmer';
    const shimmers = [];
    for (let i = 0; i < shimmerCount; i++) {
        shimmers.push(
            <Shimmer
                key={i}
                style={{paddingLeft: 10, paddingRight: 10}}
                shimmerElements={[
                    { type: ShimmerElementType.line, height: SHIMMER_HEIGHT }
                ]}
            />
        );
    }
    return (
        <div className={className}>
            {shimmers}
        </div>
    );
};
