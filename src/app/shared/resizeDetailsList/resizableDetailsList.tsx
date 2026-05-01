/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import {
    createTableColumn,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    TableColumnDefinition,
    TableColumnSizingOptions,
    TableRowId,
} from '@fluentui/react-components';

export interface IColumn {
    ariaLabel?: string;
    fieldName?: string;
    isMultiline?: boolean;
    key: string;
    maxWidth?: number;
    minWidth?: number;
    name: string;
    width?: string; // CSS width like '80%' or '200px'
}

export enum SelectionMode {
    none = 0,
    single = 1,
    multiple = 2,
}

export enum CheckboxVisibility {
    always = 0,
    onHover = 1,
    hidden = 2,
}

export interface ResizableDetailsListProps {
    ariaLabel?: string;
    ariaLabelForSelectionColumn?: string;
    ariaLabelForSelectAllCheckbox?: string;
    checkboxVisibility?: CheckboxVisibility;
    checkButtonAriaLabel?: string | ((item: any) => string); // tslint:disable-line:no-any
    className?: string;
    columns: IColumn[];
    items: any[]; // tslint:disable-line:no-any
    layoutMode?: number;
    onRenderItemColumn: (item: any, index: number, column: IColumn) => JSX.Element | string; // tslint:disable-line:no-any
    onSelectionChange?: (selectedIndices: Set<number>) => void;
    selection?: any; // kept for backwards compat, ignored internally
    selectionMode?: SelectionMode;
    getRowId?: (item: any) => TableRowId; // tslint:disable-line:no-any
}

export const ResizableDetailsList: React.FC<ResizableDetailsListProps> = props => {
    const {
        ariaLabel,
        ariaLabelForSelectAllCheckbox,
        checkboxVisibility,
        checkButtonAriaLabel,
        className,
        columns,
        items,
        onRenderItemColumn,
        onSelectionChange,
        selectionMode,
        getRowId: getRowIdProp,
    } = props;

    const getRowId = React.useCallback(
        (item: any) => getRowIdProp ? getRowIdProp(item) : String(items.indexOf(item)), // tslint:disable-line:no-any
        [getRowIdProp, items]
    );

    const dgSelectionMode = React.useMemo(() => {
        if (selectionMode === SelectionMode.none || checkboxVisibility === CheckboxVisibility.hidden) {
            return undefined; // No selection at all
        }
        if (selectionMode === SelectionMode.single) {
            return 'single' as const;
        }
        return 'multiselect' as const;
    }, [selectionMode, checkboxVisibility]);

    const showSelectionCells = selectionMode !== SelectionMode.none && checkboxVisibility !== CheckboxVisibility.hidden;

    const columnSizingOptions = React.useMemo<TableColumnSizingOptions>(() => {
        const options: TableColumnSizingOptions = {};
        for (const col of columns) {
            options[col.key] = {
                minWidth: col.minWidth || 100,
                defaultWidth: col.minWidth || 150,
                ...(col.maxWidth ? { idealWidth: col.maxWidth } : {}),
            };
        }
        return options;
    }, [columns]);

    const dgColumns = React.useMemo<TableColumnDefinition<any>[]>(() => // tslint:disable-line:no-any
        columns.map(col =>
            createTableColumn<any>({ // tslint:disable-line:no-any
                columnId: col.key,
                renderHeaderCell: () => col.name,
                renderCell: (item) => onRenderItemColumn(item, items.indexOf(item), col),
            })
        ),
        [columns, onRenderItemColumn, items]
    );

    const handleSelectionChange = React.useCallback(
        (_event: any, data: { selectedItems: Set<TableRowId> }) => { // tslint:disable-line:no-any
            if (onSelectionChange) {
                const indices = new Set<number>();
                data.selectedItems.forEach(rowId => {
                    const idx = typeof rowId === 'number' ? rowId : Number(rowId);
                    if (!isNaN(idx)) {
                        indices.add(idx);
                    }
                });
                onSelectionChange(indices);
            }
        },
        [onSelectionChange]
    );

    return (
        <DataGrid
            items={items}
            columns={dgColumns}
            getRowId={getRowId}
            resizableColumns={true}
            columnSizingOptions={columnSizingOptions}
            {...(dgSelectionMode ? { selectionMode: dgSelectionMode, onSelectionChange: handleSelectionChange } : {})}
            className={className}
            aria-label={ariaLabel}
        >
            <DataGridHeader>
                <DataGridRow
                    selectionCell={showSelectionCells ? {
                        'aria-label': ariaLabelForSelectAllCheckbox,
                    } : undefined}
                >
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell style={{ fontWeight: 600 }}>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody<any>>
                {({ item, rowId }) => (
                    <DataGridRow<any> // tslint:disable-line:no-any
                        key={rowId}
                        selectionCell={showSelectionCells ? {
                            'aria-label': typeof checkButtonAriaLabel === 'function' ? checkButtonAriaLabel(item) : checkButtonAriaLabel,
                        } : undefined}
                    >
                        {({ renderCell }) => (
                            <DataGridCell focusMode="group" className="rdl-cell" style={{ paddingRight: 8 }}>
                                {renderCell(item)}
                            </DataGridCell>
                        )}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
    );
};
