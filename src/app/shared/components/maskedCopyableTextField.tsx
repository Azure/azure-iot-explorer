/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { IconButton, IButton } from 'office-ui-fabric-react/lib/Button';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { ResourceKeys } from '../../../localization/resourceKeys';
import LabelWithTooltip from './labelWithTooltip';
import LabelWithRichCallout from './labelWithRichCallout';
import { Notification, NotificationType } from '../../api/models/notification';
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
    setFocus?: boolean;
}

export interface MaskedCopyableTextFieldActionProps {
    addNotification: (notification: Notification) => void;
}

export interface MaskedCopyableTextFieldState {
    hideContents: boolean;
}

export class MaskedCopyableTextField extends React.Component<MaskedCopyableTextFieldProps & MaskedCopyableTextFieldActionProps, MaskedCopyableTextFieldState> {
    private hiddenInputRef = React.createRef<HTMLInputElement>();
    private visibleInputRef = React.createRef<HTMLInputElement>();
    private copyButtonRef = React.createRef<IButton>();
    private labelIdentifier = getId('maskedCopyableTextField');
    private toggleMaskButtonTooltipHostId = getId('toggleMaskButtonTooltipHost');
    private copyButtonTooltipHostId = getId('copyButtonTooltipHost');

    constructor(props: MaskedCopyableTextFieldProps & MaskedCopyableTextFieldActionProps) {
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
                            ref={this.visibleInputRef}
                            value={value}
                            type={(allowMask && hideContents) ? 'password' : 'text'}
                            className="input"
                            readOnly={readOnly}
                            onChange={this.onChange}
                            placeholder={placeholder}
                            required={this.props.required}
                            aria-invalid={!!error}
                        />
                        <input
                            aria-hidden={true}
                            style={{ position: 'absolute', opacity: 0, height: '1px', width: '1px'}}
                            tabIndex={-1}
                            ref={this.hiddenInputRef}
                            value={value}
                            className="input"
                            readOnly={true}
                        />

                        {allowMask &&
                            <TooltipHost
                                content={hideContents ?
                                    t(ResourceKeys.common.maskedCopyableTextField.toggleMask.label.show) :
                                    t(ResourceKeys.common.maskedCopyableTextField.toggleMask.label.hide)}
                                id={this.toggleMaskButtonTooltipHostId}
                            >
                                <IconButton
                                    iconProps={hideContents ? { iconName: 'RedEye' } : { iconName: 'Hide' }}
                                    aria-labelledby={this.toggleMaskButtonTooltipHostId}
                                    onClick={this.toggleDisplay}
                                />
                            </TooltipHost>
                        }
                    </div>

                    <div className="copySection">
                        <TooltipHost
                            content={t(ResourceKeys.common.maskedCopyableTextField.copy.label)}
                            id={this.copyButtonTooltipHostId}
                        >
                            <IconButton
                                iconProps={{ iconName: 'copy' }}
                                aria-labelledby={this.copyButtonTooltipHostId}
                                onClick={this.copyToClipboard}
                                componentRef={this.copyButtonRef}
                            />
                        </TooltipHost>
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

            // set focus back to copy button
            const copyButtonNode = this.copyButtonRef.current;
            if (copyButtonNode) {
                copyButtonNode.focus();
            }

            // add notification
            this.props.addNotification({
                text: {
                    translationKey: ResourceKeys.notifications.copiedToClipboard
                },
                type: NotificationType.info
            });
        }
    }

    public componentDidMount() {
        if (this.props.setFocus) {
            const node = this.visibleInputRef.current;
            if (node) {
                node.focus();
            }
        }
    }
}
