/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import LabelWithTooltip from './labelWithTooltip';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../contexts/localizationContext';
import { GroupedList } from '../../constants/iconNames';
import { ResourceKeys } from '../../../localization/resourceKeys';
import '../../css/_collapsibleSection.scss';

export interface CollapsibleSectionProps {
    expanded?: boolean;
    label: string;
    tooltipText: string;
}

export interface CollapsibleSectionState {
    expanded: boolean;
}

export default class CollapsibleSection extends React.PureComponent<CollapsibleSectionProps, CollapsibleSectionState> {
    constructor(props: CollapsibleSectionProps) {
        super(props);

        this.state = {
            expanded: props.expanded
        };
    }

    public render() {
        const { children, tooltipText, label } = this.props;
        const { expanded } = this.state;
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="collapsible-section">
                        <IconButton
                            className="collapsible-section-icon"
                            iconProps={{iconName: expanded ? GroupedList.CLOSE : GroupedList.OPEN}}
                            ariaLabel={!expanded ?
                                context.t(ResourceKeys.collapsibleSection.open) :
                                context.t(ResourceKeys.collapsibleSection.close)}
                            onClick={this.toggleCollapse}
                            title={context.t(!expanded ? ResourceKeys.collapsibleSection.open : ResourceKeys.collapsibleSection.close)}
                        />
                        <LabelWithTooltip
                            tooltipText={tooltipText}
                        >
                            {label}
                        </LabelWithTooltip>
                        {expanded && children}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private toggleCollapse = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    }
}
