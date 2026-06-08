import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popover, PopoverSurface, PopoverTrigger, Text } from '@fluentui/react-components';
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

    const hiddenRef = React.useRef<HTMLInputElement | null>(null);
    const focusRef = React.useRef<HTMLButtonElement | null>(null);

    const dismissPopover = () => {
        setPopoverOpen(false);
        setCalloutTextKey(ResourceKeys.common.maskedCopyableTextField.copy.label);
    };

    const copyToClipboard = () => {
        if (hiddenRef.current) {
            hiddenRef.current.select();
            document.execCommand('copy');
        }
        if (focusRef.current) {
            focusRef.current.focus();
        }
        setCalloutTextKey(ResourceKeys.common.maskedCopyableTextField.copied.label);
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
                onOpenChange={(e, data) => setPopoverOpen(data.open)}
                positioning="above"
            >
                <PopoverTrigger disableButtonEnhancement>
                    <Button
                        appearance="subtle"
                        icon={<CopyRegular />}
                        onClick={copyToClipboard}
                        onFocus={() => setPopoverOpen(true)}
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
