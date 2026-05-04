/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Toolbar, ToolbarButton, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components';
import { ChevronDownRegular } from '@fluentui/react-icons';

interface CommandBarItem {
    key: string;
    name?: string;
    text?: string;
    ariaLabel?: string;
    disabled?: boolean;
    type?: string;
    icon?: React.ReactElement;
    onClick?: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    subMenuProps?: {
        items: CommandBarSubMenuItem[];
    };
}

interface CommandBarSubMenuItem {
    key: string;
    name?: string;
    text?: string;
    ariaLabel?: string;
    disabled?: boolean;
    icon?: React.ReactElement;
    onClick?: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}

interface CommandBarV9Props {
    items: CommandBarItem[];
    farItems?: CommandBarItem[];
    className?: string;
}

/**
 * v9-compatible CommandBar replacement using Toolbar + ToolbarButton + Menu.
 */
export const CommandBarV9: React.FC<CommandBarV9Props> = ({ items, farItems, className }) => {
    const renderItem = (item: CommandBarItem) => {
        const label = item.name || item.text;

        if (item.subMenuProps?.items?.length > 0) {
            return (
                <Menu key={item.key}>
                    <MenuTrigger disableButtonEnhancement>
                        <ToolbarButton
                            aria-label={item.ariaLabel}
                            disabled={item.disabled}
                            icon={item.icon}
                            style={{ fontWeight: 'normal' }}
                        >
                            {label} <ChevronDownRegular style={{ marginLeft: 4, fontSize: 12 }} />
                        </ToolbarButton>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            {item.subMenuProps.items.map(sub => (
                                <MenuItem
                                    key={sub.key}
                                    icon={sub.icon}
                                    disabled={sub.disabled}
                                    onClick={sub.onClick}
                                >
                                    {sub.name || sub.text}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </MenuPopover>
                </Menu>
            );
        }

        return (
            <ToolbarButton
                key={item.key}
                aria-label={item.ariaLabel}
                disabled={item.disabled}
                icon={item.icon}
                onClick={item.onClick}
                type={item.type === 'submit' ? 'submit' : 'button'}
                style={{ fontWeight: 'normal' }}
            >
                {label}
            </ToolbarButton>
        );
    };

    return (
        <Toolbar className={className}>
            {items.map(renderItem)}
            {farItems?.length > 0 && (
                <div style={{ marginLeft: 'auto', display: 'flex' }}>
                    {farItems.map(renderItem)}
                </div>
            )}
        </Toolbar>
    );
};
