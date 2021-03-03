/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { IotHubHost } from './iotHubHost';
import * as BreadcrumbEntry from '../../navigation/hooks/useBreadcrumbEntry';

jest.mock('react-router-dom', () => ({
    useParams: () => ({ hostName: 'host'}),
    useRouteMatch: () => ({ url: '' })
}));

describe('IotHubHost', () => {
    it('matches snapshot', () => {
        jest.spyOn(BreadcrumbEntry, 'useBreadcrumbEntry').mockImplementation(() => {});
        expect(shallow(<IotHubHost/>)).toMatchSnapshot();
    });
});
