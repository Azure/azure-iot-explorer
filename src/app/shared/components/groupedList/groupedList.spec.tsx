/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import GroupedList, { GroupedListProps } from './groupedList';

describe('components/GroupedList', () => {

    const getComponent = (overrides = {}) => {
        const testItems = [
            {
                Body: 'World',
                Name: 'Hello',
            },
            {
                Body: 'World1',
                Name: 'Hello1'
            }
        ];

        const onRenderCell = () => (<div/>);
        const defaultColumnInfo = [
            {
                infoText: 'Text',
                name: 'Name',
                onRenderColumn: group => {
                    return (<span>{group.name}</span>);
                },
                widthPercentage: 10
            },
            {
                infoText: 'Text',
                name: 'Body',
                onRenderColumn: group => {
                    return (<span>{group.name}</span>);
                },
                widthPercentage: 10
            }
        ];

        const props: GroupedListProps<typeof testItems[0]> = {
            columnInfo: defaultColumnInfo,
            isLoading: false,
            items: testItems,
            nameKey: 'Name',
            noItemsMessage: 'No Items',
            onRenderCell,
            ...overrides
        };

        return <GroupedList {...props} />;
    };

    context('render GroupedList', () => {
        it('matches snapshot', () => {
            const wrapper = shallow(getComponent());

            expect(wrapper).toMatchSnapshot();
        });

        it('matches snapshot when no items', () => {
            const wrapper = shallow(getComponent({items: []}));

            expect(wrapper).toMatchSnapshot();
        });

        it('matches snapshot with undefined items', () => {
            const wrapper = shallow(getComponent({items: undefined}));

            expect(wrapper).toMatchSnapshot();
        });

        it('matches snapshot when in a loading state', () => {
            const wrapper = shallow(getComponent({isLoading: true}));
            expect(wrapper).toMatchSnapshot();
        });
    });
});
