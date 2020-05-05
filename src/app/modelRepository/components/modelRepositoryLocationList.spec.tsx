/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { ModelRepositoryLocationList } from './modelRepositoryLocationList';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('components/settings/modelRepositoryLocationList', () => {

    it('matches snapshot with no items', () => {
        const component = (
            <ModelRepositoryLocationList
                repositoryLocationSettings={null}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={jest.fn()}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });
    it('matches snapshot with public item', () => {
        const component = (
            <ModelRepositoryLocationList
                repositoryLocationSettings={[{repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public}]}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={jest.fn()}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });

    it('matches snapshot with each type item', () => {
        const component = (
            <ModelRepositoryLocationList
                repositoryLocationSettings={[
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,},
                    {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local}
                ]}
                repositoryLocationSettingsErrors={{}}
                onChangeRepositoryLocationSettings={jest.fn()}
            />
        );
        expect(shallow(component)).toMatchSnapshot();
    });
});
