/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { MessageBar, MessageBarBody } from '@fluentui/react-components';
import { AppVersionMessageBar } from './appVersionMessageBar';
import * as AppVersionHelper from '../utils/appVersionHelper';
import * as githubService from '../../api/services/githubService';

jest.mock('semver');
jest.spyOn(AppVersionHelper, 'isNewReleaseVersionHigher').mockImplementation(() => {
    return true;
});
const realUseState = React.useState;
jest
  .spyOn(React, 'useState')
  .mockImplementationOnce(() => realUseState('v10.0.0'));
jest
  .spyOn(React, 'useState')
  .mockImplementationOnce(() => realUseState(true));


describe('components/devices/appVersionMessageBar', () => {
    it('shows and hides message bar', () => {
        const wrapper = shallow(<AppVersionMessageBar/>);
        const messageBar = wrapper.find(MessageBar);
        expect(messageBar).toHaveLength(1);
        const body = messageBar.find(MessageBarBody);
        expect(body).toHaveLength(1);
    });
});
