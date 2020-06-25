/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { edit, Editor } from 'brace';
import 'brace/mode/json'; // tslint:disable-line: no-submodule-imports
import 'brace/theme/xcode'; // tslint:disable-line: no-submodule-imports
import 'brace/theme/twilight'; // tslint:disable-line: no-submodule-imports
import { useThemeContext } from '../contexts/themeContext';

export interface JSONEditorProps {
    className: string;
    content: string;
    onChange?: (data: string) => void;
}

export const JSONEditor: React.FC<JSONEditorProps> = (props: JSONEditorProps) => {
    const { content, className, onChange } = props;
    const { editorTheme } = useThemeContext();
    let container: HTMLElement;
    let editor: Editor;

    // tslint:disable-next-line: no-any
    const onUpdate = (event: any) => {
        if (onChange) {
          const value = editor.getValue();
          onChange(value);
        }
    };

    React.useEffect(() => {
        if (typeof content === 'string') {
            editor = edit(container);
            editor.getSession().setMode('ace/mode/json');
            editor.setTheme(`ace/theme/${editorTheme}`);
            editor.setReadOnly(!onChange);
            editor.setValue(content);
            editor.on('change', onUpdate);
            editor.clearSelection();
        }
    },              [content, editorTheme]);

    if (typeof content !== 'string') {
        return <></>;
    }

    return (
        <article >
            <div id="ace-editor" className={className} ref={el => container = el}/>
        </article>
    );
};
