/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, getId, TooltipHost, Announced } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { LabelWithTooltip } from './labelWithTooltip';
import { LabelWithRichCallout } from './labelWithRichCallout';
import { CopyButton } from './copyButton';
import '../../css/_maskedCopyableTextField.scss';

export interface MaskedCopyableTextFieldProps {
    ariaLabel: string;
    calloutContent?: JSX.Element;
    label: string;
    labelCallout?: string;
    value: string;
    allowMask: boolean;
    placeholder?: string;
}

// tslint:disable-next-line: cyclomatic-complexity
export const MaskedCopyableTextField: React.FC<MaskedCopyableTextFieldProps> = (props: MaskedCopyableTextFieldProps) => {
    const hiddenInputRef = React.createRef<HTMLInputElement>();
    const visibleInputRef = React.createRef<HTMLInputElement>();
    const labelIdentifier = getId('maskedCopyableTextField');
    const toggleMaskButtonTooltipHostId = getId('toggleMaskButtonTooltipHost');

    const { t } = useTranslation();

    const { ariaLabel, value, allowMask, placeholder, calloutContent, labelCallout, label } = props;
    const [hideContents, setHideContents] = React.useState(allowMask);

    const renderLabelSection = () => {
        if (calloutContent) {
            return (<LabelWithRichCallout calloutContent={calloutContent} htmlFor={labelIdentifier}>{label}</LabelWithRichCallout>);
        }

        return (<LabelWithTooltip tooltipText={labelCallout} htmlFor={labelIdentifier}>{label}</LabelWithTooltip>);
    };

    const toggleDisplay = () => setHideContents(!hideContents);

    return (
        <div className="maskedCopyableTextField">
            <div className="labelSection">
                {renderLabelSection()}
            </div>

            <div className="controlSection">
                <div className="borderedSection readOnly">
                    <input
                        aria-label={ariaLabel}
                        id={labelIdentifier}
                        ref={visibleInputRef}
                        value={value || ''}
                        type={(allowMask && hideContents) ? 'password' : 'text'}
                        className="input"
                        readOnly={true}
                        placeholder={placeholder}
                    />
                    <input
                        aria-hidden={true}
                        style={{ position: 'absolute', opacity: 0, height: '1px', width: '1px' }}
                        tabIndex={-1}
                        ref={hiddenInputRef}
                        value={value || ''}
                        className="input"
                        readOnly={true}
                    />

                    {allowMask &&
                        <TooltipHost
                            content={hideContents ?
                                t(ResourceKeys.common.maskedCopyableTextField.toggleMask.label.show) :
                                t(ResourceKeys.common.maskedCopyableTextField.toggleMask.label.hide)}
                            id={toggleMaskButtonTooltipHostId}
                        >
                            <IconButton
                                iconProps={hideContents ? { iconName: 'RedEye' } : { iconName: 'Hide' }}
                                aria-labelledby={toggleMaskButtonTooltipHostId}
                                onClick={toggleDisplay}
                            />
                        </TooltipHost>
                    }
                </div>

                <div className="copySection">
                    <CopyButton copyText={value} />
                </div>
            </div>
        </div>
    );
};
