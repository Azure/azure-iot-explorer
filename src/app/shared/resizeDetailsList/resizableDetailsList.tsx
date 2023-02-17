/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ColumnActionsMode, ContextualMenu, DetailsList, IColumn, IContextualMenuProps, IDetailsList, IDetailsListProps } from '@fluentui/react';
import { ResizeDetailsListDialog } from './resizeDetailsListDialog';

export const ResizableDetailsList: React.FC<IDetailsListProps> = props => {
    const { ariaLabelForSelectionColumn, ariaLabelForSelectAllCheckbox, checkButtonAriaLabel,
            items, columns, selection, selectionMode, layoutMode, checkboxVisibility, className, onRenderItemColumn } = props;

    const [ isDialogHidden, setIsDialogHidden] = React.useState(true);
    const [ contextualMenuProps, setContextualMenuProps] = React.useState<IContextualMenuProps | undefined>(undefined);
    const detailsListRef = React.useRef<IDetailsList>(null);
    const columnToEdit = React.useRef<IColumn | null>(null);
    const onHideContextualMenu = React.useCallback(() => setContextualMenuProps(undefined), []);

    const resizeColumn = (column: IColumn) => {
        columnToEdit.current = column;
        setIsDialogHidden(false);
    };

    const getContextualMenuProps = (ev: React.MouseEvent<HTMLElement>, column: IColumn): IContextualMenuProps => {
        const menuItems = [
            { key: 'resize', text: 'Resize', onClick: () => resizeColumn(column) },
        ];

        return {
            gapSpace: 10,
            isBeakVisible: true,
            items: menuItems,
            onDismiss: onHideContextualMenu,
            target: ev.currentTarget as HTMLElement
        };
    };

    const onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        if (column.columnActionsMode !== ColumnActionsMode.disabled) {
            setContextualMenuProps(getContextualMenuProps(ev, column));
        }
    };

    const resizableColumns = columns.map(column => ({ ...column, onColumnClick, columnActionsMode: ColumnActionsMode.hasDropdown, isResizable: true}));
    return (
        <>

            <DetailsList
                ariaLabelForSelectionColumn={ariaLabelForSelectionColumn}
                ariaLabelForSelectAllCheckbox={ariaLabelForSelectAllCheckbox}
                checkboxVisibility={checkboxVisibility}
                checkButtonAriaLabel={checkButtonAriaLabel}
                className={className}
                columns={resizableColumns}
                componentRef={detailsListRef}
                items={items}
                layoutMode={layoutMode}
                selection={selection}
                selectionMode={selectionMode}
                onRenderItemColumn={onRenderItemColumn}
            />
            {contextualMenuProps && <ContextualMenu {...contextualMenuProps} />}
            <ResizeDetailsListDialog
                columnToEdit={columnToEdit}
                detailsListRef={detailsListRef}
                isDialogHidden={isDialogHidden}
                setIsDialogHidden={setIsDialogHidden}
            />
        </>
    );
};
