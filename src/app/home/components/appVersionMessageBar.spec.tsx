/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import AppVersionMessageBar from './appVersionMessageBar';
import * as AppVersionHelper from '../utils/appVersionHelper';
import { mountWithLocalization } from '../../shared/utils/testHelpers';
import { latestReleaseUrlPath } from '../../api/services/githubService';

jest.mock('semver');
describe('components/devices/appVersionMessageBar', () => {
    beforeEach(() => {
        jest.spyOn(AppVersionHelper, 'isNewReleaseVersionHigher').mockImplementation(() => {
            return true;
        });
    });

    it('shows and hides message bar', () => {
        const component = <AppVersionMessageBar/>;
        const wrapper = mountWithLocalization(component);
        const messageBarComponent = wrapper.find(AppVersionMessageBar);

        messageBarComponent.setState({latestReleaseVersion: 'v100.0.0'});
        wrapper.update();

        const messageBar = wrapper.find(MessageBar);
        expect(messageBar.props().children[0]).toEqual('deviceLists.messageBar.message');
        expect(messageBar.props().children[1].props.href).toEqual(latestReleaseUrlPath);
    });
});
