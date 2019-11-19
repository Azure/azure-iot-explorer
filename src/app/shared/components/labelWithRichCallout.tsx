/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { ILabelProps, Label } from 'office-ui-fabric-react/lib/Label';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { INFO } from '../../constants/iconNames';
import '../../css/_labelWithTooltip.scss';

export interface LabelWithRichCalloutProps extends ILabelProps {
    calloutContent: JSX.Element;
    directionalHint?: DirectionalHint;
}

export interface LabelWithRichCalloutState{
    showCallout: boolean;
}

export default class LabelWithRichCallout extends React.PureComponent<LabelWithRichCalloutProps, LabelWithRichCalloutState> {
    constructor(props: LabelWithRichCalloutProps) {
        super(props);
        this.state = {
            showCallout: false
        };
    }
    private readonly setVisibility = () => {
        this.setState({
            showCallout: true
        });
    }
    private readonly dismissCallout = () => {
        this.setState({
            showCallout: false
        });
    }

    public render(): JSX.Element {
        const { calloutContent, style } = this.props;

        const buttonId = getId('iconbutton');
        return (
            <div
                style={style}
                className="labelWithTooltip"
            >
                <Label
                    {...this.props}
                />
                {calloutContent &&
                    <>
                        <IconButton
                            iconProps={{ iconName: INFO }}
                            id={buttonId}
                            onClick={this.setVisibility}
                        />
                        <Callout
                            role="alertdialog"
                            gapSpace={0}
                            target={`#${buttonId}`}
                            setInitialFocus={true}
                            directionalHint={this.props.directionalHint || DirectionalHint.rightCenter}
                            hidden={!this.state.showCallout}
                            onDismiss={this.dismissCallout}
                        >
                            {calloutContent}
                        </Callout>
                    </>
                }
            </div>
        );
    }
}
