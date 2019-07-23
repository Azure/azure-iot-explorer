/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { GroupedList, IGroup, IGroupDividerProps } from 'office-ui-fabric-react/lib/GroupedList';
import { Shimmer, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { IconButton, BaseButton, Button } from 'office-ui-fabric-react/lib/Button';
import { ISelection, SelectionMode, Selection, SelectionZone } from 'office-ui-fabric-react/lib/Selection';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import LabelWithTooltip from '../labelWithTooltip';
import { GroupedList as GroupedListIconNames } from '../../../constants/iconNames';
import { CHECKBOX_WIDTH_PERCENTAGE, GRID_STYLE_CONSTANTS, CHECKBOX_WIDTH_PIXELS, LABEL_COLOR, LABEL_FONT_SIZE, SHIMMER_HEIGHT } from './groupedListStyleConstants';
import '../../../css/_groupedList.scss';

const SHIMMER_COUNT = 10;

export interface GroupedListProps<T> {
    isLoading: boolean;
    items: T[];
    nameKey: keyof T;
    noItemsMessage: string;
    columnInfo?: GroupedListColumn[];
    onRenderCell: (nestingDepth?: number, item?: T, index?: number) => React.ReactNode;
    onSelectionChanged?: (selectedItems: T[]) => void;
}

export interface GroupedListColumn {
    name: string;
    infoText: string;
    widthPercentage: number;
    onRenderColumn: (group: IGroup, key?: string | number) => JSX.Element;
}

export interface GroupedListState {
    groups: IGroup[];
    selection: ISelection;
    selectionMode: SelectionMode;
}

export default class GroupedListWrapper<T> extends React.Component<GroupedListProps<T>, GroupedListState> {

    constructor(props: GroupedListProps<T>) {
        super(props);

        this.state = {
            groups: [],
            selection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            selectionMode: SelectionMode.multiple
        };
    }

    public render() {
        const { columnInfo, items, isLoading, noItemsMessage } = this.props;
        const { selection, selectionMode } = this.state;

        const shimmer = [];
        for (let index = 0; index < SHIMMER_COUNT; index++) {
            shimmer.push(this.getShimmer(index));
        }

        return (
            <div className="grouped-list">
                {this.renderListHeader(columnInfo)}
                {!!isLoading ? (
                        <div>
                            {shimmer}
                        </div>
                    ) : !items || items.length === 0 ? (
                        <h3>{noItemsMessage}</h3>
                    ) : (
                        <MarqueeSelection selection={selection} isEnabled={selection.mode === SelectionMode.multiple}>
                            <SelectionZone selection={selection}>
                                <GroupedList
                                    items={this.props.items}
                                    groups={this.state.groups}
                                    groupProps={{
                                        onRenderHeader: this.onRenderHeader
                                    }}
                                    onRenderCell={this.onRenderCell}
                                    selection={selection}
                                    selectionMode={selectionMode}
                                />
                            </SelectionZone>
                        </MarqueeSelection>
                    )
                }
            </div>
        );

    }

    public shouldComponentUpdate(nextProps: GroupedListProps<T>): boolean {
        return JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items);
    }

    public static getDerivedStateFromProps<T>(props: GroupedListProps<T>, state: GroupedListState): Partial<GroupedListState> | null {
        if (typeof props.items !== 'undefined' && typeof props.nameKey !== 'undefined') {
            const groups = GroupedListWrapper.createGroups(props);

            state.selection.setItems(groups, false);

            return {
                groups
            };
        }
        return null;
    }

    private onSelectionChanged = (): void => {
        const { onSelectionChanged } = this.props;
        const { groups, selection } = this.state;
        if (!!onSelectionChanged) {
            const items = groups.filter(group => selection.isIndexSelected(group.startIndex)).map(group => {
                return group.data;
            });
            onSelectionChanged(items);
        }
    }

    private static createGroups<T>(props: GroupedListProps<T>) {
        return (props.items && props.items.map((item, index): IGroup => {
            const itemName: string = item[props.nameKey].toString();

            return {
                count: 1,
                data: item,
                isCollapsed: true,
                key: itemName + index,
                name: itemName,
                startIndex: index
            };
        })) || [];
    }

    private readonly onRenderCell = (nestingDepth?: number, item?: T, index?: number) => {
        return (
            <div className="grouped-list-group-cell">
                {this.props.onRenderCell(nestingDepth, item, index)}
            </div>
        );
    }

    private readonly onRenderHeader = (props: IGroupDividerProps) => {
        const { columnInfo } = this.props;
        const { selection } = this.state;
        const columns = columnInfo || [];

        const toggleCollapse = (event: Event | React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement | BaseButton | Button>): void => {
            props.onToggleCollapse!(props.group!);

            (event as Event).cancelBubble = true; // tslint:disable-line
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        };

        const renderColumns = columns.map((column, index) => {
            return column.onRenderColumn(props.group, index);
        });

        const customStyles = {
            height: GRID_STYLE_CONSTANTS.HEADER_HEIGHT
        };
        const styles = {...this.generateColumnStyle(columns), ...customStyles};

        const onCheckboxChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
            selection.setIndexSelected(props.group.startIndex, !!checked, false);
        };

        const isSelected = selection && selection.isIndexSelected(props.group.startIndex);

        return (
            <div className={'grouped-list-group-header'} key={props.group.key} onClick={toggleCollapse} data-selection-disabled={true} data-is-focusable={true} data-selection-index={props.group.startIndex}>
                <div
                    className={`grouped-list-group-content ${props.group.isCollapsed ? '' : 'expanded'}`}
                    style={styles}
                >
                    <Checkbox
                        className={'grouped-list-group-checkbox'}
                        styles={
                            {
                                checkbox: {
                                    borderRadius: `${CHECKBOX_WIDTH_PIXELS}px`,
                                    height: `${CHECKBOX_WIDTH_PIXELS}px`,
                                    width: `${CHECKBOX_WIDTH_PIXELS}px`
                                }
                            }
                        }
                        checked={isSelected}
                        onChange={onCheckboxChange}
                    />
                    {renderColumns}
                    <IconButton
                        id={'collapse'}
                        iconProps={{
                            iconName: props.group.isCollapsed ? GroupedListIconNames.OPEN : GroupedListIconNames.CLOSE,
                        }}
                        onClick={toggleCollapse}
                    />
                </div>
            </div>
        );
    }

    private readonly renderListHeader = (columns: GroupedListColumn[] = []) => {
        const columnOffset = 2;

        const styles = this.generateColumnStyle(columns);

        return (
            <div>
                <div
                    className={'grouped-list-header'}
                    style={styles}
                >
                {
                    columns.map((column, index) => {
                        return (
                            <LabelWithTooltip
                                key={index}
                                style={{
                                    color: LABEL_COLOR,
                                    fontSize: LABEL_FONT_SIZE,
                                    gridColumnStart: index + columnOffset
                                }}
                                tooltipText={column.infoText}
                            >
                                {column.name}
                            </LabelWithTooltip>
                        );
                    })
                }
                </div>
                <div className="grouped-list-header-border" />
            </div>
        );
    }

    private readonly generateColumnString = (columns?: GroupedListColumn[]) => {
        let columnsString = `${CHECKBOX_WIDTH_PERCENTAGE}% `;

        columns.forEach(column => {
            columnsString += column.widthPercentage + '% ';
        });

        columnsString += 'auto';

        return columnsString;
    }

    private readonly generateColumnStyle = (columns?: GroupedListColumn[]) => {
        const columnString = this.generateColumnString(columns);

        return {
            alignItems: GRID_STYLE_CONSTANTS.ALIGN_ITEMS,
            columnGap: GRID_STYLE_CONSTANTS.COLUMN_GAP,
            display: GRID_STYLE_CONSTANTS.DISPLAY,
            gridTemplateColumns: columnString
        };
    }

    private readonly getShimmer = (key: string | number) => {
        return (
            <Shimmer
                shimmerElements={[
                    { type: ShimmerElementType.line, height: SHIMMER_HEIGHT }
                ]}
                key={key}
            />
        );
    }

}
