/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { parse, Type } from 'protobufjs';
import { TextField, Panel, PanelType, Label, DetailsList, IColumn, MarqueeSelection, Selection, CommandBar, PrimaryButton } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import './deviceSimulationPanel.scss';
import { setDecoderInfoAction, setDecoderProtoFileAction, validateDecoderInfoAction } from '../actions';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { deviceEventsReducer } from '../reducers';
import { EventMonitoringSaga } from '../saga';
import { deviceEventsStateInitial } from '../state';

export interface DeviceDecoderPanelProps {
    showDecoderPanel: boolean;
    onToggleDecoderPanel: () => void;
    dispatch(action: any): void; // tslint:disable-line: no-any
}

interface PropertyItem {
    index: number;
    keyName: string;
    value: string;
}

export const DeviceDecoderPanel: React.FC<DeviceDecoderPanelProps> = props => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const [decoderProtoFile, setDecoderProtoFile] = React.useState<File>();
    const [decoderPrototype, setDecoderPrototype] = React.useState<Type | undefined>(undefined);
    const [decoderType, setDecoderType] = React.useState<string>('');
    const [localState, dispatch] = useAsyncSagaReducer(deviceEventsReducer, EventMonitoringSaga, deviceEventsStateInitial(), 'deviceEventsState');

    const onSaveDecoder = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.dispatch(setDecoderInfoAction({decoderFile: decoderProtoFile, decoderType}));
    };

    const handleProtoFileChange = (event: React.FormEvent<HTMLInputElement>) => {
        setDecoderProtoFile(event.currentTarget.files[0]);
    };

    const handleDecoderTypeChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setDecoderType(newValue);
    };

    return (
        <Panel
            isOpen={props.showDecoderPanel}
            type={PanelType.medium}
            isBlocking={false}
            onDismiss={props.onToggleDecoderPanel}
            closeButtonAriaLabel={t(ResourceKeys.common.close)}
            headerText={'Update customize decoder prototype'}
        >
            <form onSubmit={onSaveDecoder}>
            <Label>Decoder File{/*TODO: ResourceKey */}</Label>
            <input type="file" id="protoFile" name="protoFile" accept=".proto" onChange={handleProtoFileChange} />
            <Label>Decoder Type{/*TODO: ResourceKey */}</Label>
            <TextField
                value={decoderType}
                readOnly={false}
                onChange={handleDecoderTypeChange}
            />
            <PrimaryButton
                type="submit"
                text={'Save'/*t(ResourceKeys.modelRepository.types.local.folderPicker.command.openPicker)*/}
                ariaLabel={t(ResourceKeys.modelRepository.types.local.folderPicker.command.openPicker)}
                disabled={localState.decoder.payload?.hasError}
            />
        </form>
        </Panel>
    );
};
