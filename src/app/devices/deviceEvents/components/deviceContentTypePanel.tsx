/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Panel, PanelType, Label, PrimaryButton, FontIcon, IconButton, Stack, Dropdown, IDropdownOption } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { useDeviceEventsStateContext } from '../context/deviceEventsStateContext';

export interface DeviceContentTypePanelProps {
    showContentTypePanel: boolean;
    onToggleContentTypePanel: () => void;
}

export const DeviceContentTypePanel: React.FC<DeviceContentTypePanelProps> = props => {
    const { t } = useTranslation();
    const [decoderProtoFile, setDecoderProtoFile] = React.useState<File>();
    const [decoderType, setDecoderType] = React.useState<string>('');
    const [ state, api ] = useDeviceEventsStateContext();
    const [isContentTypeCustomized, setIsContentTypeCustomized] = React.useState<boolean>(state.contentType.isContentTypeCustomized);

    React.useEffect(() => {
        if (state.formMode === 'setDecoderSucceeded') {
            props.onToggleContentTypePanel();
        }
    },              [state.formMode]);

    const onSaveContentType = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        api.setDecoderInfo({decoderFile: decoderProtoFile, decoderType, isContentTypeCustomized});
    };

    const handleProtoFileChange = (event: React.FormEvent<HTMLInputElement>) => {
        setDecoderProtoFile(event.currentTarget.files[0]);
    };

    const handleDecoderTypeChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setDecoderType(newValue);
    };

    const formDecodeProtptypeName = (value: string) => {
        // Type start with '.', therefore removing it
        return value?.substring(1);
    };

    const OnRemoveDecodePrototype = () => {
        api.removeDecoderInfo();
        setDecoderProtoFile(null);
        setDecoderType('');
    };

    const options: IDropdownOption[] = [
        { key: 'json', text: 'JSON' },
        { key: 'protobuf', text: 'Protobuf' }
    ];

    const onDropdownSelectedKeyChanged = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
        setIsContentTypeCustomized(option.key === 'protobuf');
    };

    return (
        <Panel
            isOpen={props.showContentTypePanel}
            type={PanelType.medium}
            isBlocking={false}
            onDismiss={props.onToggleContentTypePanel}
            closeButtonAriaLabel={t(ResourceKeys.common.close)}
            headerText={t(ResourceKeys.deviceEvents.customizeContentType.header)}
        >
            <form onSubmit={onSaveContentType}>
                <Stack tokens={{childrenGap: 10}}>
                    <Dropdown
                        disabled={state.formMode === 'working'}
                        required={true}
                        label={t(ResourceKeys.deviceEvents.customizeContentType.contentTypeOption.label)}
                        options={options}
                        defaultSelectedKey={isContentTypeCustomized ? 'protobuf' : 'json'}
                        onChange={onDropdownSelectedKeyChanged}
                    />
                    {isContentTypeCustomized &&
                        <>
                            <Label>{t(ResourceKeys.deviceEvents.customizeContentType.protobuf.file.label)}</Label>
                            <input
                                type="file"
                                id="protoFile"
                                name="protoFile"
                                accept=".proto"
                                required={state.contentType.decoderProtoFile === undefined}
                                disabled={state.formMode === 'working'}
                                onChange={handleProtoFileChange}
                            />
                            {state.contentType.decoderProtoFile &&
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <IconButton
                                        iconProps={{ iconName: 'ChromeClose', style: {fontSize: 12} }}
                                        title={t(ResourceKeys.deviceEvents.customizeContentType.protobuf.file.removeFile)}
                                        ariaLabel={t(ResourceKeys.deviceEvents.customizeContentType.protobuf.file.removeFile)}
                                        onClick={OnRemoveDecodePrototype}
                                        disabled={state.formMode === 'working'}
                                    />
                                    <FontIcon aria-label="FileCode" iconName="FileCode" />
                                    {state.contentType.decoderProtoFile?.name}
                                </div>
                            }
                            <TextField
                                defaultValue={formDecodeProtptypeName(state.contentType.decoderPrototype?.fullName)}
                                disabled={state.formMode === 'working'}
                                label={t(ResourceKeys.deviceEvents.customizeContentType.protobuf.type.label)}
                                readOnly={false}
                                onChange={handleDecoderTypeChange}
                                placeholder={t(ResourceKeys.deviceEvents.customizeContentType.protobuf.type.placeholder)}
                            />
                        </>
                    }
                    <PrimaryButton
                        disabled={state.formMode === 'working'}
                        type="submit"
                        text={t(ResourceKeys.deviceEvents.customizeContentType.save)}
                        ariaLabel={t(ResourceKeys.deviceEvents.customizeContentType.save)}
                    />
                </Stack>
            </form>
        </Panel>
    );
};
