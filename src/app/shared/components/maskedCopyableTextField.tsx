/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IconButton, IButton } from 'office-ui-fabric-react/lib/Button';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { LabelWithTooltip } from './labelWithTooltip';
import { LabelWithRichCallout } from './labelWithRichCallout';
import { NotificationType } from '../../api/models/notification';
import { useLocalizationContext } from '../contexts/localizationContext';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import '../../css/_maskedCopyableTextField.scss';

export interface MaskedCopyableTextFieldProps {
    ariaLabel: string;
    calloutContent?: JSX.Element;
    label: string;
    labelCallout?: string;
    error?: string;
    value: string;
    allowMask: boolean;
    readOnly: boolean;
    required?: boolean;
    onTextChange?(text: string): void;
    placeholder?: string;
    setFocus?: boolean;
}

// tslint:disable-next-line: cyclomatic-complexity
export const MaskedCopyableTextField: React.FC<MaskedCopyableTextFieldProps> = (props: MaskedCopyableTextFieldProps) => {
    const hiddenInputRef = React.createRef<HTMLInputElement>();
    const visibleInputRef = React.createRef<HTMLInputElement>();
    const copyButtonRef = React.createRef<IButton>();
    const labelIdentifier = getId('maskedCopyableTextField');
    const toggleMaskButtonTooltipHostId = getId('toggleMaskButtonTooltipHost');
    const copyButtonTooltipHostId = getId('copyButtonTooltipHost');

    const { t } = useLocalizationContext();

    const { setFocus, ariaLabel, error, value, allowMask, readOnly, placeholder, calloutContent, labelCallout, required, label, onTextChange } = props;
    const [ hideContents, setHideContents ] = React.useState(allowMask);

    React.useEffect(() => {
        if (setFocus) {
            const node = visibleInputRef.current;
            if (node) {
                node.focus();
            }
        }
    },              [setFocus]);

    const renderLabelSection = () => {
        if (calloutContent) {
            return (<LabelWithRichCallout calloutContent={calloutContent} htmlFor={labelIdentifier} required={required}>{label}</LabelWithRichCallout>);
        }

        return(<LabelWithTooltip tooltipText={labelCallout} htmlFor={labelIdentifier} required={required}>{label}</LabelWithTooltip>);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setHideContents(false);

        if (onTextChange) {
            onTextChange(text);
        }
    };

    const toggleDisplay = () => setHideContents(!hideContents);

    const copyToClipboard = () => {
        const node = hiddenInputRef.current;
        if (node) {
            node.select();
            document.execCommand('copy');

            // set focus back to copy button
            const copyButtonNode = copyButtonRef.current;
            if (copyButtonNode) {
                copyButtonNode.focus();
            }

            // add notification
            raiseNotificationToast({
                text: {
                    translationKey: ResourceKeys.notifications.copiedToClipboard
                },
                type: NotificationType.info
            });
        }
    };

    return (
        <div className="maskedCopyableTextField">
            <div className="labelSection">
                {renderLabelSection()}
            </div>

            <div className="controlSection">
                <div className={`borderedSection ${error ? 'error' : ''} ${readOnly ? 'readOnly' : ''}`}>
                    <input
                        aria-label={ariaLabel}
                        id={labelIdentifier}
                        ref={visibleInputRef}
                        value={value}
                        type={(allowMask && hideContents) ? 'password' : 'text'}
                        className="input"
                        readOnly={readOnly}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={props.required}
                    />
                    <input
                        aria-hidden={true}
                        style={{ position: 'absolute', opacity: 0, height: '1px', width: '1px'}}
                        tabIndex={-1}
                        ref={hiddenInputRef}
                        value={value}
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
                    <TooltipHost
                        content={t(ResourceKeys.common.maskedCopyableTextField.copy.label)}
                        id={copyButtonTooltipHostId}
                    >
                        <IconButton
                            iconProps={{ iconName: 'copy' }}
                            aria-labelledby={copyButtonTooltipHostId}
                            onClick={copyToClipboard}
                            componentRef={copyButtonRef}
                        />
                    </TooltipHost>
                </div>
            </div>

            {error &&
                <>
                    <div className="errorSection" aria-live={'assertive'}>{error}</div>
                    <Announced message={error}/>
                </>
            }

        </div>
    );
};
