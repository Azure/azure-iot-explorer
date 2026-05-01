/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import {
    tokens,
} from '@fluentui/react-components';
import {
    AddRegular,
    CheckmarkRegular,
    CheckboxCheckedRegular,
    AddCircleRegular,
    AddCircleFilled,
    DismissRegular,
    DismissCircleRegular,
    CodeRegular,
    CopyRegular,
    CheckboxUncheckedRegular,
    EditRegular,
    FolderOpenRegular,
    QuestionCircleRegular,
    InfoRegular,
    NavigationRegular,
    ArrowSyncRegular,
    DeleteRegular,
    KeyboardShiftRegular,
    SaveRegular,
    PlayRegular,
    StopFilled,
    CloudArrowUpRegular,
    ArrowSyncCheckmarkRegular,
    WarningRegular,
    RemoteRegular,
    MailRegular,
    LocationRegular,
    ArrowLeftRegular,
    BookRegular,
    ArrowUndoRegular,
    ArrowUploadRegular,
    ChevronDownRegular,
    ChevronUpRegular,
    ChevronRightRegular,
    CaretRightFilled,
    CaretDownFilled,
    BoxRegular,
    ChatRegular,
    FilterRegular,
    ArrowForwardRegular,
    EyeOffRegular,
    EyeRegular,
    AlertRegular,
    SearchRegular,
    SettingsRegular,
    PersonRegular,
    SignOutRegular,
    ArrowSwapRegular,
    KeyRegular,
    OrganizationRegular,
    PlugDisconnectedRegular,
    ServerRegular,
    DocumentCopyRegular,
    BranchForkRegular,
    ChatMultipleRegular,
} from '@fluentui/react-icons';

type IconComponent = React.FC<{ className?: string; style?: React.CSSProperties }>;

/**
 * Maps v8 icon string names to v9 icon components.
 * Used during the incremental migration from @fluentui/react to @fluentui/react-components.
 */
const iconMap: Record<string, IconComponent> = {
    // From iconNames.ts constants
    Add: AddRegular,
    Accept: CheckmarkRegular,
    Cancel: DismissRegular,
    SkypeCheck: CheckmarkRegular,
    CheckboxComposite: CheckboxCheckedRegular,
    CircleAddition: AddCircleRegular,
    CircleAdditionSolid: AddCircleFilled,
    Clear: DismissCircleRegular,
    ChromeClose: DismissRegular,
    Code: CodeRegular,
    Copy: CopyRegular,
    Checkbox: CheckboxUncheckedRegular,
    EditSolid12: EditRegular,
    OpenFolderHorizontal: FolderOpenRegular,
    Help: QuestionCircleRegular,
    Info: InfoRegular,
    GlobalNavButton: NavigationRegular,
    Refresh: ArrowSyncRegular,
    Delete: DeleteRegular,
    ReturnKey: KeyboardShiftRegular,
    Save: SaveRegular,
    Play: PlayRegular,
    StopSolid: StopFilled,
    CloudUpload: CloudArrowUpRegular,
    SyncOccurence: ArrowSyncCheckmarkRegular,
    Warning: WarningRegular,
    Remote: RemoteRegular,
    Mail: MailRegular,
    LocationDot: LocationRegular,
    NavigateBack: ArrowLeftRegular,
    Repo: BookRegular,
    Undo: ArrowUndoRegular,
    Upload: ArrowUploadRegular,

    // GroupedList / InterfaceDetailCard
    ChevronDown: ChevronDownRegular,
    ChevronUp: ChevronUpRegular,
    ChevronRight: ChevronRightRegular,

    // Accordion
    CaretSolidRight: CaretRightFilled,
    CaretSolidDown: CaretDownFilled,

    // ArrayOperation
    BoxAdditionSolid: BoxRegular,

    // Heading
    SkypeMessage: ChatRegular,

    // Inline icon references (from component files)
    Filter: FilterRegular,
    Forward: ArrowForwardRegular,
    Hide: EyeOffRegular,
    RedEye: EyeRegular,
    back: ArrowLeftRegular,
    copy: CopyRegular,
    Ringer: AlertRegular,
    Search: SearchRegular,
    Settings: SettingsRegular,
    Signin: PersonRegular,
    Signout: SignOutRegular,
    SwitcherStartEnd: ArrowSwapRegular,
    Permissions: KeyRegular,
    AADLogo: OrganizationRegular,
    AzureKeyVault: KeyRegular,
    Org: OrganizationRegular,
    PlugDisconnected: PlugDisconnectedRegular,
    Server: ServerRegular,
    ReopenPages: DocumentCopyRegular,
    TFVCLogo: BranchForkRegular,
    Message: ChatMultipleRegular,
};

/**
 * Get a v9 icon component by its v8 icon name string.
 * Returns undefined if no mapping exists.
 */
export const getV9Icon = (v8IconName: string): IconComponent | undefined => {
    return iconMap[v8IconName];
};

/**
 * Get a v9 icon element by its v8 icon name string.
 * Returns a rendered icon element, or null if unmapped.
 */
export const renderV9Icon = (v8IconName: string, className?: string): React.ReactElement | null => {
    const Icon = iconMap[v8IconName];
    if (!Icon) {
        return null;
    }
    return React.createElement(Icon, { className, style: { color: tokens.colorBrandForeground1 } });
};
