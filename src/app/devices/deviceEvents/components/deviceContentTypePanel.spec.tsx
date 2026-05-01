/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeviceContentTypePanel, DeviceContentTypePanelProps } from './deviceContentTypePanel';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';

jest.mock('../context/deviceEventsStateContext', () => ({
    useDeviceEventsStateContext: jest.fn()
}));

describe('DeviceContentTypePanel', () => {
    const mockSetDecoderInfo = jest.fn();
    const mockSetDefaultDecodeInfo = jest.fn();

    const defaultState = {
        formMode: 'initialized',
        contentType: {
            decodeType: 'JSON' as const,
            decoderProtoFile: undefined,
            decoderPrototype: undefined
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (deviceEventsStateContext.useDeviceEventsStateContext as jest.Mock).mockReturnValue([
            defaultState,
            { setDecoderInfo: mockSetDecoderInfo, setDefaultDecodeInfo: mockSetDefaultDecodeInfo }
        ]);
    });

    it('renders drawer with header when panel is shown', () => {
        render(<DeviceContentTypePanel showContentTypePanel={true} onToggleContentTypePanel={jest.fn()}/>);

        expect(screen.getByText('deviceEvents.customizeContentType.header')).toBeDefined();
    });

    it('does not render drawer content when panel is hidden', () => {
        render(<DeviceContentTypePanel showContentTypePanel={false} onToggleContentTypePanel={jest.fn()}/>);

        expect(screen.queryByText('deviceEvents.customizeContentType.header')).toBeNull();
    });

    it('renders content type dropdown label and save button', () => {
        render(<DeviceContentTypePanel showContentTypePanel={true} onToggleContentTypePanel={jest.fn()}/>);

        expect(screen.getByText('deviceEvents.customizeContentType.contentTypeOption.label')).toBeDefined();
        expect(screen.getByText('deviceEvents.customizeContentType.save')).toBeDefined();
    });

    it('calls onToggleContentTypePanel when close button is clicked', () => {
        const onToggle = jest.fn();
        render(<DeviceContentTypePanel showContentTypePanel={true} onToggleContentTypePanel={onToggle}/>);

        fireEvent.click(screen.getByLabelText('common.close'));
        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('does not show protobuf fields in JSON mode', () => {
        render(<DeviceContentTypePanel showContentTypePanel={true} onToggleContentTypePanel={jest.fn()}/>);

        expect(screen.queryByText('deviceEvents.customizeContentType.protobuf.file.label')).toBeNull();
    });
});
