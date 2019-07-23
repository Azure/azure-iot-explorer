/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import React, { Component } from 'react';
import { IconButton, Label,  } from 'office-ui-fabric-react';
import { Accordion } from '../../../constants/iconNames';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import '../../../css/_interfaceCollapse.scss';

interface InterfaceCollapseProps {
    text: string;
    open: boolean;
}

export default class InterfaceCollapse extends Component<InterfaceCollapseProps> {
    public render() {
        const { open, text } = this.props;
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="collapse">
                        <IconButton
                            className="button"
                            iconProps={{ iconName: open ? Accordion.OPEN : Accordion.CLOSE }}
                            title={context.t(open ? ResourceKeys.template.collapse.open : ResourceKeys.template.collapse.close)}
                        />
                        <Label className="label">{text}</Label>
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }
}
