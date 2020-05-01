/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import SettingsPane from './settingsPane';
import { testSnapshot } from '../../shared/utils/testHelpers';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('components/settings/settingsPane', () => {
    const pathname = '/devices';
    const location: any = { // tslint:disable-line:no-any
        pathname,
    };
    const routerprops: any = { // tslint:disable-line:no-any
        history: {
            location,
        },
        location,
        match: {
            params: {
            }
        }
    };

    it('matches snapshot is not open', () => {
        const component = (
            <SettingsPane
                {...routerprops}
                isOpen={false}
                onSettingsVisibleChanged={jest.fn()}
            />
        );
        testSnapshot(component);
    });

    it('matches snapshot open', () => {
        const component = (
            <SettingsPane
                {...routerprops}
                isOpen={true}
                onSettingsVisibleChanged={jest.fn()}
            />
        );
        testSnapshot(component);
    });

    it('matches snapshot with repositoryLocations', () => {
        const component = (
            <SettingsPane
                {...routerprops}
                isOpen={true}
                onSettingsVisibleChanged={jest.fn()}
            />
        );
        testSnapshot(component);
    });
});
