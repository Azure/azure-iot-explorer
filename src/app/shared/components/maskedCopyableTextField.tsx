/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { ResourceKeys } from '../../../localization/resourceKeys';
import LabelWithTooltip from './labelWithTooltip';
import LabelWithRichCallout from './labelWithRichCallout';
import '../../css/_maskedCopyableTextField.scss';

export interface MaskedCopyableTextFieldProps {
    ariaLabel: string;
    calloutContent?: JSX.Element;
    label: string;
    labelCallout?: string;
    error?: string;
    value: string;
    allowMask: boolean;
    t: TranslationFunction;
    readOnly: boolean;
    required?: boolean;
    onTextChange?(text: string): void;
    placeholder?: string;
}

export interface MaskedCopyableTextFieldState {
    hideContents: boolean;
}

export class MaskedCopyableTextField extends React.Component<MaskedCopyableTextFieldProps, MaskedCopyableTextFieldState> {
    private hiddenInputRef = React.createRef<HTMLInputElement>();
    private visibileInputRef = React.createRef<HTMLInputElement>();
    private labelIdentifier = getId('maskedCopyableTextField');

    constructor(props: MaskedCopyableTextFieldProps) {
        super(props);
        this.state = {
            hideContents: props.allowMask
        };
    }
    // tslint:disable-next-line:cyclomatic-complexity
    public render(): JSX.Element {
        const { ariaLabel, error, value, allowMask, t, readOnly, placeholder } = this.props;
        const { hideContents } = this.state;

        return (
            <div className="maskedCopyableTextField">
                <div className="labelSection">
                    {this.renderLabelSection()}
                </div>

                <div className="controlSection">
                    <div className={`borderedSection ${error ? 'error' : ''} ${readOnly ? 'readOnly' : ''}`}>
                        <input
                            aria-label={ariaLabel}
                            id={this.labelIdentifier}
                            ref={this.visibileInputRef}
                            value={value}
                            type={(allowMask && hideContents) ? 'password' : 'text'}
                            className="input"
                            readOnly={readOnly}
                            onChange={this.onChange}
                            placeholder={placeholder}
                        />
                        <input
                            aria-label={ariaLabel}
                            style={{ position: 'absolute', left: '-9000px', top: '-9000px'}}
                            tabIndex={-1}
                            ref={this.hiddenInputRef}
                            value={value}
                            className="input"
                            readOnly={true}
                        />

                        {allowMask &&
                            <IconButton
                                iconProps={hideContents ? { iconName: 'RedEye' } : { iconName: 'Hide' }}
                                title={t(ResourceKeys.common.maskedCopyableTextField.toggleMask.label)}
                                ariaLabel={t(ResourceKeys.common.maskedCopyableTextField.toggleMask.ariaLabel)}
                                onClick={this.toggleDisplay}
                            />
                        }
                    </div>

                    <div className="copySection">
                        <IconButton
                            iconProps={{ iconName: 'copy' }}
                            title={t(ResourceKeys.common.maskedCopyableTextField.copy.label)}
                            ariaLabel={t(ResourceKeys.common.maskedCopyableTextField.copy.ariaLabel)}
                            onClick={this.copyToClipboard}
                        />
                    </div>
                </div>

                {error &&
                    <div className="errorSection">{error}</div>
                }

            </div>
        );
    }
    private readonly renderLabelSection = () => {
        const { calloutContent, label, labelCallout, required } = this.props;
        if (calloutContent) {
            return (<LabelWithRichCallout calloutContent={calloutContent} htmlFor={this.labelIdentifier} required={required}>{label}</LabelWithRichCallout>);
        }

        return(<LabelWithTooltip tooltipText={labelCallout} htmlFor={this.labelIdentifier} required={required}>{label}</LabelWithTooltip>);
    }

    public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        this.setState({
            hideContents: false
        });

        if (this.props.onTextChange) {
            this.props.onTextChange(text);
        }
    }

    public toggleDisplay = () => {
            this.setState({
            hideContents: !this.state.hideContents
        });
    }

    public copyToClipboard = () => {
        const node = this.hiddenInputRef.current;
        if (node) {
            node.select();
            document.execCommand('copy');
        }
    }

    public focus = () => {
        const node = this.visibileInputRef.current;
        if (node) {
            node.focus();
        }
    }
}
