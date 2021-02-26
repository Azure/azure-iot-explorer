/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { IotHubResource } from './iotHubResource';
import * as BreadcrumbEntry from '../../navigation/hooks/useBreadcrumbEntry';

jest.mock('react-router-dom', () => ({
    useParams: () => ({ resourceName: 'resource'}),
    useRouteMatch: () => ({ url: '' })
}));

describe('IotHubResource', () => {
    it('matches snapshot', () => {
        jest.spyOn(BreadcrumbEntry, 'useBreadcrumbEntry').mockImplementation(() => {});
        expect(shallow(<IotHubResource/>)).toMatchSnapshot();
    });
});
