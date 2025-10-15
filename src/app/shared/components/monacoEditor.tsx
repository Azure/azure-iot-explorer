import * as React from 'react';
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

const placeholderContentWidget = (
  editor: monaco.editor.IStandaloneCodeEditor,
  placeholder: string
): void => {
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

/**
 * MonacoEditorComponent with enhanced accessibility features
 *
 * Accessibility improvements:
 * - Escape key exits the editor to prevent keyboard trap
 * - Alt+M provides alternative exit method
 * - Tab key can exit editor when at end of content
 * - Proper ARIA labels and screen reader support
 * - Accessible focus management with next focusable element detection
 */
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
  const editorRef = React.useRef(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const handleEditorEscape = React.useCallback(() => {
    /* Enhanced focus escape mechanism for accessibility.
        This helps users exit the Monaco Editor keyboard trap using Escape or Alt+M.
        We properly blur the editor and move focus to the next focusable element. */
    if (editorRef.current) {
      const editor = editorRef.current as any;
      
      // Get the editor DOM node and wrapper
      const editorDomNode = editor.getDomNode();
      const wrapperElement = wrapperRef.current;
      
      // First, ensure the editor loses focus
      if (editorDomNode) {
        (editorDomNode as HTMLElement).blur();
        // Also try to blur any focused element within the editor
        const activeElement = document.activeElement;
        if (activeElement && editorDomNode.contains(activeElement)) {
          (activeElement as HTMLElement).blur();
        }
      }
      
      // Find all focusable elements in the document
      const focusableElements = document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"]):not([disabled])'
      );
      
      const focusableArray = Array.from(focusableElements) as HTMLElement[];
      
      // Find the wrapper's position in the focusable elements
      let wrapperIndex = -1;
      if (wrapperElement) {
        for (let i = 0; i < focusableArray.length; i++) {
          if (focusableArray[i] === wrapperElement || wrapperElement.contains(focusableArray[i])) {
            wrapperIndex = i;
            break;
          }
        }
      }
      
      // Try to focus the next focusable element after the wrapper
      let nextElement: HTMLElement | null = null;
      if (wrapperIndex >= 0) {
        // Look for the next element after the wrapper
        for (let i = wrapperIndex + 1; i < focusableArray.length; i++) {
          const candidate = focusableArray[i];
          if (!wrapperElement?.contains(candidate) && candidate.offsetParent !== null) {
            nextElement = candidate;
            break;
          }
        }
      }
      
      if (nextElement) {
        nextElement.focus();
      } else {
        // If no next element, try to find any focusable element outside the editor wrapper
        const alternativeElement = focusableArray.find(el => 
          !wrapperElement?.contains(el) && el.offsetParent !== null
        );
        if (alternativeElement) {
          alternativeElement.focus();
        } else {
          // Final fallback: focus the document body
          if (document.body.tabIndex === -1) {
            document.body.tabIndex = 0;
          }
          document.body.focus();
          // Remove focus from any active element
          if (document.activeElement && document.activeElement !== document.body) {
            (document.activeElement as HTMLElement).blur();
          }
        }
      }
    }
  }, []);

  const handleEditorDidMount = React.useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor): void => {
      editorRef.current = editor;
      placeholderContentWidget(editor, placeholder || '');

      // Enhanced accessibility: Escape key to exit editor
      editor.addCommand(monaco.KeyCode.Escape, () => {
        // Force blur the editor first by removing focus from DOM node
        const editorDomNode = editor.getDomNode();
        if (editorDomNode) {
          (editorDomNode as any).blur();
        }
        // Then call our escape handler
        handleEditorEscape();
      });

      // Alt+M command for manual focus escape
      editor.addCommand(
        monaco.KeyMod.Alt + monaco.KeyCode.KeyM,
        () => {
          // Force blur the editor first by removing focus from DOM node
          const editorDomNode = editor.getDomNode();
          if (editorDomNode) {
            (editorDomNode as any).blur();
          }
          // Then call our escape handler
          handleEditorEscape();
        }
      );

      // Configure editor for better accessibility
      editor.updateOptions({
        accessibilitySupport: 'on',
        cursorBlinking: 'blink',
        // Add screen reader optimizations
        screenReaderAnnounceInlineSuggestion: true,
        // Ensure proper focus handling
        selectOnLineNumbers: false,
        tabFocusMode: false, // Allow Tab to move focus out of editor
      });

      // Handle Tab key for proper navigation
      editor.addCommand(monaco.KeyCode.Tab, () => {
        // If there's no selection and cursor is at end, allow Tab to exit
        const selection = editor.getSelection();
        const model = editor.getModel();
        if (model && selection && selection.isEmpty()) {
          const position = selection.getStartPosition();
          const lineContent = model.getLineContent(position.lineNumber);
          const isAtEndOfLine = position.column > lineContent.length;
          const isLastLine = position.lineNumber === model.getLineCount();

          if (isAtEndOfLine && isLastLine) {
            handleEditorEscape();
            return;
          }
        }
        // Otherwise, perform normal Tab indentation
        editor.trigger('keyboard', 'tab', {});
      });
    },
    [placeholder, handleEditorEscape]
  );

  return (
    <div
      ref={wrapperRef}
      role='region'
      aria-label={`Code editor: ${ariaLabel}. Press Escape or Alt+M to exit editor.`}
      tabIndex={-1}
    >
      <MonacoEditor
        height={height}
        width={'98%'}
        theme={editorTheme === 'light' ? 'vs' : 'vs-dark'}
        className={editorTheme === 'light' ? editorStyleLight : editorStyleDark}
        editorDidMount={handleEditorDidMount}
        value={content}
        language={language || 'json'}
        options={{
            accessibilitySupport: 'on',
            ariaLabel: ariaLabel,
          automaticLayout: true,
          minimap: {
              enabled: false, // Do not display the preview slide on the right
            },
            readOnly,
            screenReaderAnnounceInlineSuggestion: true,
            tabFocusMode: false,
          wordWrap: 'on', // Enable word wrap
          wrappingIndent: 'indent', // Adjust the wrapping indent as needed
        }}
        aria-label={ariaLabel}
        onChange={onChange}
        editorWillMount={editorWillMount}
      />
    </div>
  );
};
