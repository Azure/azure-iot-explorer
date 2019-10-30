/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Shimmer, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';

const SHIMMER_HEIGHT = 20;
const SHIMMER_COUNT = 3;
export const RenderMultiLineShimmer = (className?: string, shimmerCount: number = SHIMMER_COUNT) => {
    const shimmers = [];
    for (let i = 0; i < shimmerCount; i++) {
        shimmers.push(
            <Shimmer
                key={i}
                style={{marginBottom: 10}}
                width="95%"
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
