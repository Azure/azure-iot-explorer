/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { shallow } from 'enzyme';
import * as React from 'react';
import { LabelWithTooltip } from './labelWithTooltip';

describe('components/shared/labelWithTooltip', () => {

    it('matches snapshot when tooltip specified', () => {
        expect(shallow(
            <LabelWithTooltip
                tooltipText="calloutText"
            >
                {'labelText'}
            </LabelWithTooltip>
        )).toMatchSnapshot();
    });

    it('matches snapshot when not tooltip specified', () => {
        expect(shallow(
            <LabelWithTooltip>
                {'labelText'}
            </LabelWithTooltip>
        )).toMatchSnapshot();
    });
});
