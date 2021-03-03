/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
    it('matches snapshot when link is disabled', () => {
        expect(shallow(
            <Breadcrumb
                disableLink={true}
                url={'url'}
                name={'name'}
                suffix={''}
                path={'path'}
            />
        )).toMatchSnapshot();
    });

    it('matches snapshot when link is enabled', () => {
        expect(shallow(
            <Breadcrumb
                disableLink={false}
                url={'url'}
                name={'name'}
                suffix={''}
                path={'path'}
            />
        )).toMatchSnapshot();
    });

    it('matches snapshot when suffix is truthy', () => {
        expect(shallow(
            <Breadcrumb
                disableLink={false}
                url={'url'}
                name={'name'}
                suffix={'suffix'}
                path={'path'}
            />
        )).toMatchSnapshot();
    });
});