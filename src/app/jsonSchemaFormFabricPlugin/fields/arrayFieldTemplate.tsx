/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DirectionalHint } from 'office-ui-fabric-react/lib/components/ContextualMenu';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { TooltipHost } from 'office-ui-fabric-react/lib/components/Tooltip';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { ArrayFieldTemplateProps } from 'react-jsonschema-form';
import Collapsible from 'react-collapsible';
import { INFO, Accordion, ArrayOperation } from '../../constants/iconNames';
import { ResourceKeys } from '../../../localization/resourceKeys';
import '../css/_arrayFieldTemplate.scss';

const uiDescriptionKey = 'ui:description';
export const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
    const { t } = useTranslation();
    return (
        <div className="arrayField">
            <Collapsible
                trigger={generateTriggerContent(props, true)}
                triggerWhenOpen={generateTriggerContent(props, false)}
                open={true}
            >
                <div className="children">
                {props.items.map(({ children, hasRemove, onDropIndexClick, index }) => (
                    <div key={index} className="childContainer">
                        <div className="child">{children}</div>
                        {(hasRemove && !props.disabled &&
                            <IconButton
                                iconProps={{ iconName: ArrayOperation.REMOVE }}
                                title={t(ResourceKeys.template.array.remove)}
                                onClick={onDropIndexClick(index)}
                            />
                        )}
                    </div>
                ))}
                </div>
                { props.items && !props.disabled &&
                <IconButton
                    className="addChildButton"
                    iconProps={{ iconName: ArrayOperation.ADD }}
                    title={t(ResourceKeys.template.array.add)}
                    onClick={props.onAddClick}
                />}
            </Collapsible>
        </div>
    );
};

const generateTriggerContent = (props: ArrayFieldTemplateProps, open: boolean) => {
    const hostId = getId('hostId');
    const { t } = useTranslation();
    return (
        <>
        <div className="content">
                <IconButton
                    iconProps={{ iconName: open ? Accordion.OPEN_ARRAY : Accordion.CLOSE_ARRAY }}
                    title={t(open ? ResourceKeys.template.collapse.open : ResourceKeys.template.collapse.close)}
                />
                {props.schema.title && (
                    <Label>{props.schema.title}</Label>
                )}
                {props.uiSchema[uiDescriptionKey] && (
                    <TooltipHost
                        content={props.uiSchema[uiDescriptionKey]}
                        id={hostId}
                        calloutProps={{ gapSpace: 0 }}
                        directionalHint={DirectionalHint.rightCenter}
                    >
                        <IconButton
                            iconProps={{ iconName: INFO }}
                            aria-labelledby={hostId}
                        />
                    </TooltipHost>
                )}
            </div>
        </>
    );
};
