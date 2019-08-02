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
import '../../css/_copyableMaskField.scss';

export interface CopyableMaskFieldProps {
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
}

export interface CopyableMaskFieldState {
    hideContents: boolean;
}

export class CopyableMaskField extends React.Component<CopyableMaskFieldProps, CopyableMaskFieldState> {
    private myRef = React.createRef<HTMLInputElement>();
    private labelIdentifier = getId('copyableMaskField');

    constructor(props: CopyableMaskFieldProps) {
        super(props);
        this.state = {
            hideContents: props.allowMask
        };
    }
    // tslint:disable-next-line:cyclomatic-complexity
    public render(): JSX.Element {
        const { ariaLabel, calloutContent, error, label, labelCallout, value, allowMask, t, readOnly, required } = this.props;
        const { hideContents } = this.state;

        return (
            <div className="copyableMaskField">
                <div className="labelSection">
                    {this.renderLabelSection()}
                </div>

                <div className="controlSection">
                    <div className={`borderedSection ${error ? 'error' : ''} ${readOnly ? 'readOnly' : ''}`}>
                        <input
                            aria-label={ariaLabel}
                            id={this.labelIdentifier}
                            value={value}
                            type={(allowMask && hideContents) ? 'password' : 'text'}
                            className="input"
                            readOnly={this.props.readOnly}
                            onChange={this.onChange}
                        />
                        <input
                            style={{ position: 'absolute', left: '-9000px', top: '-9000px'}}
                            tabIndex={-1}
                            ref={this.myRef}
                            value={value}
                            className="input"
                            readOnly={true}
                        />

                        {allowMask &&
                            <IconButton
                                iconProps={hideContents ? { iconName: 'RedEye' } : { iconName: 'Hide' }}
                                title={t(ResourceKeys.common.copyableMaskField.toggleMask.label)}
                                ariaLabel={t(ResourceKeys.common.copyableMaskField.toggleMask.ariaLabel)}
                                onClick={this.toggleDisplay}
                            />
                        }
                    </div>

                    <div className="copySection">
                        <IconButton
                            iconProps={{ iconName: 'copy' }}
                            title={t(ResourceKeys.common.copyableMaskField.copy.label)}
                            ariaLabel={t(ResourceKeys.common.copyableMaskField.copy.ariaLabel)}
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
        const node = this.myRef.current;
        if (node) {
            node.select();
            document.execCommand('copy');
        }
    }
}
