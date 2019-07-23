/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList';
import { DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../contexts/localizationContext';

export interface DetailListActions
{
    clearItems?: () => void;
    onRowSelectionChange?: (selectedItem: any) => void; // tslint:disable-line:no-any
}

export interface DetailListProps extends DetailListActions{
    columns: IColumn[];
    isLoading: boolean;
    items: any[]; // tslint:disable-line:no-any
    noItemsMessage: string;
    spinnerTitle: string;
    className?: string;
}

interface DetailListState {
    rowSelected: boolean;
    selection: Selection;
}

export default class DetailListWrapper extends React.Component<DetailListProps, DetailListState> {
    constructor(props: DetailListProps) {
        super(props);
        this.state = {
            rowSelected: false,
            selection: new Selection({
                onSelectionChanged: () => {
                    if (this.props.onRowSelectionChange) {
                        const selectedItem = this.state.selection.getSelection() as any; // tslint:disable-line:no-any
                        this.setState({
                            rowSelected: true
                        });
                        this.props.onRowSelectionChange(selectedItem);
                    }
                }
            }),
        };
    }

    public render() {

        const { items, isLoading, noItemsMessage, columns } = this.props;

        if ( !isLoading && (!items || !items.length)) {
            return (
                    <LocalizationContextConsumer>
                        {(context: LocalizationContextInterface) => (
                            <h3>{context.t(noItemsMessage)}</h3>
                        )}
                    </LocalizationContextConsumer>);
        }

        return this.getList(items, columns);
    }

    public componentWillUnmount() {
        if (!!this.props.clearItems) {
            this.props.clearItems();
        }
    }

    private readonly getList = (items: any[], columns: IColumn[]) => { // tslint:disable-line:no-any

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <ShimmeredDetailsList
                        className={this.props.className}
                        setKey="items"
                        items={items}
                        columns={this.localizeListColumns(context.t, columns)}
                        selectionMode={SelectionMode.multiple}
                        enableShimmer={this.props.isLoading}
                        selection={this.state.selection}
                        layoutMode={DetailsListLayoutMode.justified}
                    />
                )}
            </LocalizationContextConsumer>);
    }

    private readonly localizeListColumns = (t: TranslationFunction, columns: IColumn[]) => {
        return columns.map(column => {
            return {
                ...column,
                name: t(column.name)
            };
        });
    }
}
