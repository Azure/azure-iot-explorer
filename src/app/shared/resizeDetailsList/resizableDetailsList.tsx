/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
    createTableColumn,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    TableColumnDefinition,
    TableColumnSizingOptions,
    TableRowId,
} from '@fluentui/react-components';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ChevronDownRegular } from '@fluentui/react-icons';
import { ResizeColumnDialog } from './resizeColumnDialog';
import '../../css/_resizableDetailsList.scss';

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
    autoFitColumns?: boolean;
    checkboxVisibility?: CheckboxVisibility;
    checkButtonAriaLabel?: string | ((item: any) => string); // tslint:disable-line:no-any
    className?: string;
    columns: IColumn[];
    items: any[]; // tslint:disable-line:no-any
    layoutMode?: number;
    onRenderItemColumn: (item: any, index: number, column: IColumn) => React.JSX.Element | string; // tslint:disable-line:no-any
    onSelectionChange?: (selectedIndices: Set<number>) => void;
    selection?: any; // kept for backwards compat, ignored internally
    selectionMode?: SelectionMode;
    getRowId?: (item: any) => TableRowId; // tslint:disable-line:no-any
}

export const ResizableDetailsList: React.FC<ResizableDetailsListProps> = props => {
    const { t } = useTranslation();
    const {
        ariaLabel,
        ariaLabelForSelectAllCheckbox,
        autoFitColumns = true,
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

    // Column being resized via the "Resize Column" dialog (undefined when closed).
    const [resizeColumnId, setResizeColumnId] = React.useState<string | undefined>(undefined);
    // Captured from the DataGrid header render prop so the dialog (rendered
    // outside that scope) can apply an exact width via setColumnWidth.
    const columnSizingRef = React.useRef<any>(null); // tslint:disable-line:no-any


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
        <>
        <div className="rdl-scroll-container">
        <DataGrid
            items={items}
            columns={dgColumns}
            getRowId={getRowId}
            resizableColumns={true}
            resizableColumnsOptions={{ autoFitColumns }}
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
                    {({ renderHeaderCell, columnId }, dataGrid) => {
                        columnSizingRef.current = dataGrid.columnSizing_unstable;
                        return (
                            <Menu>
                                <MenuTrigger disableButtonEnhancement={true}>
                                    <DataGridHeaderCell
                                        className="rdl-header-cell"
                                    >
                                        <span className="rdl-header-label">{renderHeaderCell()}</span>
                                        <ChevronDownRegular className="rdl-header-chevron" aria-hidden={true} />
                                    </DataGridHeaderCell>
                                </MenuTrigger>
                                <MenuPopover>
                                    <MenuList>
                                        <MenuItem onClick={() => setResizeColumnId(String(columnId))}>
                                            {t(ResourceKeys.resizableDetailsList.buttons.resize)}
                                        </MenuItem>
                                        <MenuItem onClick={dataGrid.columnSizing_unstable.enableKeyboardMode(columnId)}>
                                            {t(ResourceKeys.resizableDetailsList.buttons.keyboardResize)}
                                        </MenuItem>
                                    </MenuList>
                                </MenuPopover>
                            </Menu>
                        );
                    }}
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
                            <DataGridCell focusMode="group" className="rdl-cell">
                                {renderCell(item)}
                            </DataGridCell>
                        )}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
        </div>
        <ResizeColumnDialog
            open={resizeColumnId !== undefined}
            onResize={width => columnSizingRef.current?.setColumnWidth(resizeColumnId, width)}
            onDismiss={() => setResizeColumnId(undefined)}
        />
        </>
    );
};
