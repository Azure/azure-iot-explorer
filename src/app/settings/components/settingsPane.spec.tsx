/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount } from 'enzyme';
import SettingsPane from './settingsPane';
import { testWithLocalizationContext } from '../../shared/utils/testHelpers';
import { LocalizationContextProvider } from '../../shared/contexts/localizationContext';
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
        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
            <SettingsPane
                {...routerprops}
                isOpen={false}
                onSettingsSave={jest.fn()}
                onSettingsVisibleChanged={jest.fn()}
                repositoryLocations={null}
            />
        </LocalizationContextProvider>
        );
        expect(mount(wrapper)).toMatchSnapshot();
    });

    it('matches snapshot open', () => {
        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
            <SettingsPane
                {...routerprops}
                isOpen={true}
                onSettingsSave={jest.fn()}
                onSettingsVisibleChanged={jest.fn()}
                repositoryLocations={null}
            />
        </LocalizationContextProvider>
        );
        expect(mount(wrapper)).toMatchSnapshot();
    });

    it('matches snapshot with repositoryLocations', () => {
        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
            <SettingsPane
                {...routerprops}
                isOpen={true}
                onSettingsSave={jest.fn()}
                onSettingsVisibleChanged={jest.fn()}
                repositoryLocations={[{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Private}]}
            />
        </LocalizationContextProvider>
        );
        expect(mount(wrapper)).toMatchSnapshot();
    });
});
