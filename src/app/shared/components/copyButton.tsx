import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popover, PopoverProps, PopoverSurface, PopoverTrigger, Text, useAnnounce } from '@fluentui/react-components';
import { CopyRegular } from '@fluentui/react-icons';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface CopyButtonProps {
    copyText: string;
    disabled?: boolean;
}
export const CopyButton: React.FC<CopyButtonProps> = ({ copyText, disabled }) => {
    const { t } = useTranslation();
    const [popoverOpen, setPopoverOpen] = React.useState<boolean>(false);
    const [calloutTextKey, setCalloutTextKey] = React.useState<string>(ResourceKeys.common.maskedCopyableTextField.copy.label);
    const { announce } = useAnnounce();

    const hiddenRef = React.useRef<HTMLInputElement | null>(null);
    const focusRef = React.useRef<HTMLButtonElement | null>(null);
    // PopoverTrigger merges its own toggle into the button's onClick, so a click while
    // the popover is already open (the usual case, since hover/focus opens it) would
    // close it and hide the "Copied" confirmation. This flag suppresses that one close.
    const copyingRef = React.useRef<boolean>(false);

    const dismissPopover = () => {
        setPopoverOpen(false);
        setCalloutTextKey(ResourceKeys.common.maskedCopyableTextField.copy.label);
    };

    const handlePopoverOpenChange: PopoverProps['onOpenChange'] = (_event, data) => {
        const suppressClose = copyingRef.current;
        copyingRef.current = false;
        if (data.open) {
            setPopoverOpen(true);
        } else if (!suppressClose) {
            dismissPopover();
        }
    };

    const copyToClipboard = () => {
        if (hiddenRef.current) {
            hiddenRef.current.select();
            document.execCommand('copy');
        }
        if (focusRef.current) {
            focusRef.current.focus();
        }
        copyingRef.current = true;
        setPopoverOpen(true);
        setCalloutTextKey(ResourceKeys.common.maskedCopyableTextField.copied.label);
        announce(t(ResourceKeys.common.maskedCopyableTextField.copied.label));
    };

    return (
        <>
            <input
                aria-hidden={true}
                disabled={disabled}
                style={{ position: 'absolute', opacity: 0, height: '1px', width: '1px'}}
                tabIndex={-1}
                ref={hiddenRef}
                value={copyText}
                className="input"
                readOnly={true}
            />
            <Popover
                open={popoverOpen}
                onOpenChange={handlePopoverOpenChange}
                positioning="above"
            >
                <PopoverTrigger disableButtonEnhancement>
                    <Button
                        appearance="subtle"
                        icon={<CopyRegular />}
                        onClick={copyToClipboard}
                        onFocus={() => setPopoverOpen(true)}
                        onBlur={dismissPopover}
                        onMouseEnter={() => setPopoverOpen(true)}
                        onMouseLeave={dismissPopover}
                        ref={focusRef}
                        aria-label={t(ResourceKeys.common.maskedCopyableTextField.copy.label)}
                    />
                </PopoverTrigger>
                <PopoverSurface style={{padding: 4}}>
                    <Text>{t(calloutTextKey)}</Text>
                </PopoverSurface>
            </Popover>
        </>
    );
};
