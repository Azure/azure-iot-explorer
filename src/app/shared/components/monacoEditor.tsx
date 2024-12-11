import * as React from 'react';
import { useRef } from 'react';
import { mergeStyleSets } from '@fluentui/react';
import MonacoEditor, { EditorWillMount, monaco } from 'react-monaco-editor';
import { useThemeContext } from '../contexts/themeContext';
import { THEME_DARK, THEME_LIGHT } from './style';

export const editorStyles = mergeStyleSets({
    editorStyleDark: {
        borderColor: THEME_DARK.BORDER,
        borderStyle: 'solid',
        borderWidth: '1px',
    },
    editorStyleLight: {
        borderColor: THEME_LIGHT.BORDER,
        borderStyle: 'solid',
        borderWidth: '1px',
    },
});

const placeholderStyles = mergeStyleSets({
    placeholderText: {
        color: 'gray',
        fontStyle: 'italic',
        userSelect: 'text',
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const placeholderContentWidget = (editor: any, placeholder: string): void => {
    const { placeholderText } = placeholderStyles;
    const widget = {
        domNode: null as HTMLElement | null,
        getDomNode: (): HTMLElement | null => {
            if (!widget.domNode) {
                widget.domNode = document.createElement('pre');
                widget.domNode.className = placeholderText;
                widget.domNode.textContent = placeholder;
                editor.applyFontInfo(widget.domNode);
            }
            return widget.domNode;
        },
        getId: () => 'editor.widget.placeholderHint',
        getPosition: () => ({
            position: { lineNumber: 1, column: 1 },
            preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
        }),
    };

    const updatePlaceholder = (): void => {
        if (editor.getValue() === '') {
            editor.addContentWidget(widget);
        } else {
            editor.removeContentWidget(widget);
        }
    };

    editor.onDidChangeModelContent(updatePlaceholder);
    updatePlaceholder();
};

interface MonacoEditorComponentProps {
    content: string;
    ariaLabel: string;
    height: number;
    readOnly?: boolean;
    language?: string;
    onChange?: (value: string) => void;
    editorWillMount?: EditorWillMount;
    placeholder?: string;
}
export const MonacoEditorComponent: React.FC<MonacoEditorComponentProps> = ({
    content,
    ariaLabel,
    readOnly,
    language,
    height,
    onChange,
    editorWillMount,
    placeholder,
}) => {
    const { editorTheme } = useThemeContext();
    const { editorStyleLight, editorStyleDark } = editorStyles;
    const editorRef = useRef(null);

    return (
        <MonacoEditor
            height={height}
            width={'98%'}
            theme={editorTheme === 'light' ? 'vs' : 'vs-dark'}
            className={editorTheme === 'light' ? editorStyleLight : editorStyleDark}
            editorDidMount={(editor): void => {
                editorRef.current = editor;
                placeholderContentWidget(editor, placeholder || '');
            }}
            value={content}
            language={language || 'json'}
            options={{
                automaticLayout: true,
                minimap: {
                    enabled: false, // Do not display the preview slide on the right
                },
                readOnly,
                wordWrap: 'on', // Enable word wrap
                wrappingIndent: 'indent', // Adjust the wrapping indent as needed
            }}
            aria-label={ariaLabel}
            onChange={onChange}
            editorWillMount={editorWillMount}
        />
    );
};
