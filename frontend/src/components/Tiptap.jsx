import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import React from 'react'

// กำหนด Editor
const Tiptap = ({ onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Underline,
            Placeholder.configure({
                placeholder: ({ node }) => {
                    console.log('node type:', node.type.name) // Debug
                    return node.type.name === 'paragraph'
                        ? 'Start writing your story...'
                        : null
                },
            })


        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg focus:outline-none min-h-[400px] py-4',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange && onChange(html) // ส่ง content ไปยัง parent (เช่น WritePage)
        },
    })

    return (
        <div className="border rounded-lg p-4 bg-white">
            {editor && (
                <>
                    {/* Bubble Menu: ปรากฏเมื่อเลือกข้อความ */}
                    <BubbleMenu editor={editor} className="bg-white border shadow rounded flex gap-2 px-2 py-1">
                        <button onClick={() => editor.chain().focus().toggleBold().run()} className="font-bold">B</button>
                        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="italic">I</button>
                        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="underline">U</button>
                    </BubbleMenu>

                    {/* Floating Menu: ปรากฏเมื่ออยู่บรรทัดใหม่ */}
                    <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white border shadow rounded px-3 py-2 space-x-2">
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
                    </FloatingMenu>
                </>
            )}

            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap
