/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DrawerBody, DrawerHeader, DrawerHeaderTitle, Dropdown, Field, Input, Label, Option, OverlayDrawer } from '@fluentui/react-components';
import { DismissRegular, DocumentCode16Regular } from '@fluentui/react-icons';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { useDeviceEventsStateContext } from '../context/deviceEventsStateContext';
import { DecodeType } from '../state';

export interface DeviceContentTypePanelProps {
    showContentTypePanel: boolean;
    onToggleContentTypePanel: () => void;
}

export const DeviceContentTypePanel: React.FC<DeviceContentTypePanelProps> = props => {
    const { t } = useTranslation();
    const [decoderProtoFile, setDecoderProtoFile] = React.useState<File>();
    const [decoderPrototype, setDecoderPrototype] = React.useState<string>('');
    const [ state, api ] = useDeviceEventsStateContext();
    const [decodeType, setDecodeType] = React.useState<DecodeType>(state.contentType.decodeType);

    React.useEffect(() => {
        if (state.formMode === 'setDecoderSucceeded') {
            props.onToggleContentTypePanel();
        }
    },              [state.formMode]); // eslint-disable-line react-hooks/exhaustive-deps -- only react to formMode change

    const onSaveContentType = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        api.setDecoderInfo({decoderFile: decoderProtoFile, decoderPrototype, decodeType});
    };

    const handleProtoFileChange = (event: React.FormEvent<HTMLInputElement>) => {
        setDecoderProtoFile(event.currentTarget.files[0]);
    };

    const handleDecoderTypeChange = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
        setDecoderPrototype(data.value);
    };

    const formDecodePrototypeName = (value: string) => {
        // Type start with '.', therefore removing it
        return value?.substring(1);
    };

    const OnRemoveDecodePrototype = () => {
        api.setDefaultDecodeInfo();
        setDecoderProtoFile(null);
        setDecoderPrototype('');
    };

    const onDropdownSelectedKeyChanged = (event: React.SyntheticEvent, data: { optionValue?: string }): void => {
        if (data.optionValue === 'JSON') {
            setDecodeType('JSON');
        }
        else if (data.optionValue === 'Protobuf') {
            setDecodeType('Protobuf');
        }
    };

    return (
        <OverlayDrawer
            open={props.showContentTypePanel}
            position="end"
            size="medium"
            onOpenChange={(e, data) => { if (!data.open) {props.onToggleContentTypePanel();} }}
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            icon={<DismissRegular />}
                            onClick={props.onToggleContentTypePanel}
                            aria-label={t(ResourceKeys.common.close)}
                        />
                    }
                >
                    {t(ResourceKeys.deviceEvents.customizeContentType.header)}
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                <form onSubmit={onSaveContentType}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Field
                            label={t(ResourceKeys.deviceEvents.customizeContentType.contentTypeOption.label)}
                            required={true}
                        >
                            <Dropdown
                                disabled={state.formMode === 'working'}
                                defaultSelectedOptions={[decodeType]}
                                onOptionSelect={onDropdownSelectedKeyChanged}
                            >
                                <Option value="JSON">JSON</Option>
                                <Option value="Protobuf">Protobuf</Option>
                            </Dropdown>
                        </Field>
                        {decodeType !== 'JSON' &&
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
                                        <Button
                                            appearance="subtle"
                                            icon={<DismissRegular />}
                                            title={t(ResourceKeys.deviceEvents.customizeContentType.protobuf.file.removeFile)}
                                            aria-label={t(ResourceKeys.deviceEvents.customizeContentType.protobuf.file.removeFile)}
                                            onClick={OnRemoveDecodePrototype}
                                            disabled={state.formMode === 'working'}
                                        />
                                        <DocumentCode16Regular aria-label="FileCode" />
                                        {state.contentType.decoderProtoFile?.name}
                                    </div>
                                }
                                <Field
                                    label={t(ResourceKeys.deviceEvents.customizeContentType.protobuf.type.label)}
                                >
                                    <Input
                                        defaultValue={formDecodePrototypeName(state.contentType.decoderPrototype?.fullName)}
                                        disabled={state.formMode === 'working'}
                                        readOnly={false}
                                        onChange={handleDecoderTypeChange}
                                        placeholder={t(ResourceKeys.deviceEvents.customizeContentType.protobuf.type.placeholder)}
                                    />
                                </Field>
                            </>
                        }
                        <Button
                            appearance="primary"
                            disabled={state.formMode === 'working'}
                            aria-label={t(ResourceKeys.deviceEvents.customizeContentType.save)}
                        >
                            {t(ResourceKeys.deviceEvents.customizeContentType.save)}
                        </Button>
                    </div>
                </form>
            </DrawerBody>
        </OverlayDrawer>
    );
};
