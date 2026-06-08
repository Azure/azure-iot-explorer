/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Skeleton, SkeletonItem } from '@fluentui/react-components';
import '../../css/_multilineShimmer.scss';

const SHIMMER_HEIGHT = 16;
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
            <Skeleton
                key={i}
                animation="wave"
                style={{padding: '6px 10px'}}
            >
                <SkeletonItem size={SHIMMER_HEIGHT} />
            </Skeleton>
        );
    }
    return (
        <div className={className} role="status" aria-label="Loading" aria-busy="true">
            {shimmers}
        </div>
    );
};
