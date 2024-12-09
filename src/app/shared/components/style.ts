export const STANDARD_GAP = 6;
export const SECTION_GAP = 18;
export const MAX_FORM_WIDTH = 650;
export const BORDER_RADIUS = 4;
export const EXPAND_CONTENT_MARGIN = 40;

export const LAYOUT_AREA_STYLE = { paddingInlineStart: '4px', paddingInlineEnd: '10px' };
export const TAB_BODY_STYLE = { marginBlockStart: '16px' };
export const JSON_INDENT = 4;

export interface THEME {
    BORDER: string;
    DEVICE_STATUS: {
        CANCELED: string;
        COMPLETED_FAILED: string;
        COMPLETED_SUCCEEDED: string;
        IN_PROGRESS: string;
        UNACCOUNTED: string;
    };
}

export const THEME_LIGHT: THEME = {
    BORDER: 'rgb(204, 204, 204)',
    DEVICE_STATUS: {
        CANCELED: '#F7630C',
        COMPLETED_FAILED: '#C50F1F',
        COMPLETED_SUCCEEDED: '#107C10',
        IN_PROGRESS: '#015CDA',
        UNACCOUNTED: 'rgb(204, 204, 204)',
    },
};

export const THEME_DARK: THEME = {
    BORDER: 'rgb(59, 58, 57)',
    DEVICE_STATUS: {
        CANCELED: '#F7630C',
        COMPLETED_FAILED: '#F63747',
        COMPLETED_SUCCEEDED: '#7ABA12',
        IN_PROGRESS: '#2899f5',
        UNACCOUNTED: 'rgb(204, 204, 204)',
    },
};
