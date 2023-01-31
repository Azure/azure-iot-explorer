import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, IButton, Callout, DirectionalHint, Text } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface CopyButtonProps {
    copyText: string;
    disabled?: boolean;
}
export const CopyButton: React.FC<CopyButtonProps> = ({ copyText, disabled }) => {
    const { t } = useTranslation();
    const [calloutVisible, setCalloutVisible] = React.useState<boolean>(false);
    const [calloutRole, setCalloutRole] = React.useState<'dialog' | 'alert'>('dialog');
    const [calloutTextKey, setCalloutTextKey] = React.useState<string>(ResourceKeys.common.maskedCopyableTextField.copy.label);

    const calloutRef = React.useRef<HTMLDivElement | null>(null);
    const hiddenRef = React.useRef<HTMLInputElement | null>(null);
    const focusRef = React.useRef<IButton | null>(null);

    const enableCallout = () => {
        setCalloutVisible(true);
    };

    const dismissCallout = () => {
        setCalloutVisible(false);
        setCalloutTextKey(ResourceKeys.common.maskedCopyableTextField.copy.label);
        setCalloutRole('dialog');
    };

    const copyToClipboard = () => {
        if (hiddenRef.current) {
            hiddenRef.current.select();
            document.execCommand('copy');
        }
        if (focusRef.current) {
            focusRef.current.focus();
        }
        setCalloutRole('alert');
        setCalloutTextKey(ResourceKeys.common.maskedCopyableTextField.copied.label);
    };

    return (
        <>
            <div ref={calloutRef}>
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
                <IconButton
                    iconProps={{ iconName: 'copy' }}
                    onClick={copyToClipboard}
                    onFocus={enableCallout}
                    onMouseEnter={enableCallout}
                    onMouseLeave={dismissCallout}
                    componentRef={focusRef}
                />
            </div>
            {calloutVisible && (
                <Callout
                    role={calloutRole}
                    gapSpace={0}
                    target={calloutRef.current}
                    directionalHint={DirectionalHint.topAutoEdge}
                    setInitialFocus={true}
                    style={{padding: 4, height: 20}}
                >
                    <Text>{t(calloutTextKey)}</Text>
                </Callout>
            )}
        </>
    );
};
