import { BugOutlined, DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import Editor from '@swordjs/monaco-editor-react';
import type { EditorProps } from '@swordjs/monaco-editor-react'
import { Button, message } from 'antd';
import { FC, useRef } from 'react';

import styles from './../subs.module.scss'
import ideStyles from './index.module.scss'


interface Props {
    expandAction: boolean
    editorOptions: EditorProps['options']
    // 点击调试按钮
    onClickDebug: (code: { [key: string]: any }) => void
}

type EditorInputContainerProps = Props;

export const EditorInputContainer: FC<EditorInputContainerProps> = (props) => {
    const editorRef = useRef<any>(null);

    // 点击调试按钮
    const onClickDebug = () => {
        // 获取脚本内容, 查看是否是json格式
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const code: string = editorRef.current.getValue().replace(/\s/g, '');
            const parseCode = JSON.parse(code) as { [key: string]: any };
            if (typeof parseCode === 'object') {
                props.onClickDebug(parseCode);
            }
            return;
            // eslint-disable-next-line no-empty
        } catch (error) { }
        // 不是json格式
        void message.warning('脚本内容不是json格式');
    }
    return (
        <div className={`${ideStyles['input-container']}`}>
            <div className="flex justify-between">
                <div className="title">输入</div>
                {props.expandAction && <RedoOutlined color="#C0C4CE" size={20} className="cursor-pointer mt-2" />}
            </div>
            {props.expandAction && <>
                <Editor
                    language="json"
                    height="80%"
                    defaultValue="{}"
                    onMount={(monacoEditor) => {
                        editorRef.current = monacoEditor;
                        monacoEditor.updateOptions({ minimap: { enabled: false } })
                    }}
                    options={{
                        ...props.editorOptions
                    }}
                    className={`${styles.monaco}`}
                />
                <div className="debug">
                    <Button onClick={onClickDebug} icon={<BugOutlined />} type="primary" style={{ boxShadow: '0px 5px 4px 0px rgba(255,209,209,0.3)', borderRadius: '5px' }} danger>调试</Button>
                </div>
            </>
            }
        </div>
    )
}

type EditorOutPutContainerProps = Pick<Props, 'expandAction'>;

export const EditorOutPutContainer: FC<EditorOutPutContainerProps> = (props) => {
    return <div className={`${ideStyles['output-container']}`}>
        <div className="flex justify-between">
            <div className="title">输出</div>
            {props.expandAction && <DeleteOutlined color="#C0C4CE" size={20} className="cursor-pointer mt-2" />}
        </div>
        {/* 控制台输出 */}
        {
            props.expandAction && <div className="output">
                <div className="output-item">
                    {'>'} 2021-08-12 19:20:00
                </div>
            </div>
        }
    </div>
}


const IdeActionContainer: FC<Props> = ({ expandAction, editorOptions, onClickDebug }) => {
    return <div className={`${ideStyles['ide-action']} flex`}>
        <EditorInputContainer onClickDebug={onClickDebug} expandAction={expandAction} editorOptions={editorOptions} />
        <EditorOutPutContainer expandAction={expandAction} />
    </div>
}

export default IdeActionContainer;