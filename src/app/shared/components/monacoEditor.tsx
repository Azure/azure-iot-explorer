/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { useThemeContext } from '../contexts/themeContext';

export interface MonacoEditorViewViewProps {
    className: string;
    content: object;
}

export const MonacoEditorView: React.FC<MonacoEditorViewViewProps> = (props: MonacoEditorViewViewProps) => {
    const { monacoTheme } = useThemeContext();

    const EditorPromise = import('react-monaco-editor');
    const Editor = React.lazy(() => EditorPromise);

    if (!props.content) {
        return <></>;
    }

    return (
        <article >
            <div className={props.className}>
                <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                    <Editor
                        language="json"
                        value={JSON.stringify(props.content, null, '\t')}
                        options={{
                            automaticLayout: true,
                            readOnly: true
                        }}
                        theme={monacoTheme}
                    />
                </React.Suspense>
            </div>
        </article>
    );
};
