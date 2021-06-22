/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Callout, ILabelProps, Label, IconButton, DirectionalHint, getId } from '@fluentui/react';
import { INFO } from '../../constants/iconNames';
import '../../css/_labelWithTooltip.scss';

export interface LabelWithRichCalloutProps extends ILabelProps {
    calloutContent: JSX.Element;
    directionalHint?: DirectionalHint;
}

export interface LabelWithRichCalloutState{
    showCallout: boolean;
}

export const LabelWithRichCallout: React.FC<LabelWithRichCalloutProps> = React.memo((props: LabelWithRichCalloutProps) => {
    const { calloutContent, directionalHint, style } = props;
    const [ showCallout, setShowCallout ] = React.useState<boolean>(false);

    const setVisibility = () => setShowCallout(true);
    const dismissCallout = () => setShowCallout(false);
    const buttonId = getId('iconbutton');

    return (
        <div
            style={style}
            className="labelWithTooltip"
        >
            <Label
                {...props}
            />
            {calloutContent &&
                <>
                    <IconButton
                        iconProps={{ iconName: INFO }}
                        id={buttonId}
                        onClick={setVisibility}
                    />
                    { showCallout && <Callout
                        role="alertdialog"
                        gapSpace={0}
                        target={`#${buttonId}`}
                        setInitialFocus={true}
                        directionalHint={directionalHint || DirectionalHint.rightCenter}
                        hidden={!showCallout}
                        onDismiss={dismissCallout}
                    >
                        {calloutContent}
                    </Callout>}
                </>
            }
        </div>
    );
});
