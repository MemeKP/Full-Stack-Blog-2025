import './editor.css'

import { useEditor, EditorContent, BubbleMenu, FloatingMenu, isActive } from '@tiptap/react'
import { PiLinkBold, PiCodeBold } from "react-icons/pi";
import { AiOutlineStrikethrough } from "react-icons/ai";

import StarterKit from '@tiptap/starter-kit'
import Paragraph from '@tiptap/extension-paragraph'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Heading from '@tiptap/extension-heading'
import Italic from '@tiptap/extension-italic'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'

import React, { Children, useCallback } from 'react'
import DropDownMenu from '../DropDownMenu';

// กำหนด Editor
const Tiptap = ({ onChange }) => {

    const editor = useEditor({
        extensions: [
            Paragraph,
            Text,
            StarterKit,
            Bold,
            Underline,
            Italic,
            Strike,
            Code,
            TextStyle.configure({ mergeNestedSpanStyles: true }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        // disallowed domains
                        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }

                        // all checks have passed
                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: url => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch {
                        return false
                    }
                },
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    //console.log('node type:', node.type.name) // Debug
                    return node.type.name === 'paragraph'
                        ? 'Start writing your story...'
                        : null
                },
            })

        ],
        content: `
        
        `,
        editorProps: {
            attributes: {
                class: 'prose prose-lg focus:outline-none min-h-[400px] py-4',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange && onChange(html) // ส่ง content ไปยัง parent (WritePage)
        },
    })

    if (!editor) {
        return null
    }

    const toggleMark = (editor, markType) => {
        if (editor.isActive(markType)) {
            editor.chain().focus().unsetMark(markType).run()
        } else {
            editor.chain().focus().setMark(markType).run()
        }
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        try {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url })
                .run()
        } catch (e) {
            alert(e.message)
        }
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className="border-none p-4">
            {editor && (
                <>

                    {/* Bubble Menu: ปรากฏเมื่อเลือกข้อความ */}
                    <BubbleMenu editor={editor} className="bg-white border shadow rounded flex gap-2 px-2 py-1">
                        <button onClick={() => editor.chain().focus().toggleBold().run()} className="font-bold">B</button>
                        <button onClick={() => editor.chain.focus().toggleHeading({ level: 1 }).run()}
                            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                        >
                            H1
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                        >
                            H2
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                        >
                            H3
                        </button>
                        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="italic">I</button>
                        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="underline">U</button>
                    </BubbleMenu>

                    {/* Floating Menu: ปรากฏเมื่ออยู่บรรทัดใหม่ */}

                    <FloatingMenu
                        editor={editor}
                        tippyOptions={{
                            duration: 100,
                            offset: [-40, 4],
                        }}
                        className="flex min-w-0 bg-white border shadow-lg rounded-full px-2 py-1  space-x-3"
                    >
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className='w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-200 transition text-sm font-medium'
                        >
                            H1
                        </button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className='w-8 h-8 flex items-center justify-center   text-black rounded-full hover:bg-gray-200 transition text-sm font-medium'
                        >
                            H2
                        </button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className='w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-200 transition text-sm font-medium'
                        >
                            H3
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'italic')}
                            className={
                                `w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-200 transition text-sm font-medium
                                ${editor.isActive('italic') ? 'bg-gray-200' : ''}`
                            }
                        >
                            𝐼
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'bold')}
                            className={`w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-200 transition text-sm font-medium
                                ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                        >
                            B
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'underline')}
                            className={`w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-200 transition text-sm font-medium
                                ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
                        >
                            U̲
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'strike')}
                            className={`w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-200 transition text-sm font-medium
                                ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
                        >
                            <AiOutlineStrikethrough className='h-4 w-4' />
                        </button>
                        <button
                            onClick={setLink}
                            className={`w-8 h-8 flex items-center justify-center text-black rounded-full hover:bg-gray-200 transition text-sm font-medium
                                ${editor.isActive('link') ? 'is-active' : ''}`}>
                            <PiLinkBold className='w-4 h-4' />
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'code')}
                            className={`w-8 h-8 flex items-center justify-center text-black rounded-full hover:bg-gray-200 transition text-sm font-medium
                                ${editor.isActive('link') ? 'is-active' : ''}`}
                        >
                            <PiCodeBold className='w-4 h-4' />
                        </button>

                        <div className='shrink-0 min-w-0'>
                            <DropDownMenu />
                        </div>
                    </FloatingMenu>

                </>
            )}

            <EditorContent editor={editor} className='className="tiptap prose prose-xl max-w-none"' />
        </div>
    )
}

export default Tiptap

//  items={[
//                                         { label: "Paragraph", onClick: () => editor.chain().focus().setParagraph().run() },
//                                         { label: "Horizontal Rule", onClick: () => editor.chain().focus().insertHorizontalRule().run() },
//                                         { label: "Do Something", onClick: () => alert("Do something") }
//                                     ]}
// // const FloatingButton = ({ onClick, children, isActive }) => (
//     <button
//         onClick={onClick}
//         className={`w-8 h-8 flex items-center justify-center text-black rounded-lg hover:bg-gray-200 transition text-sm font-medium ${isActive ? 'bg-gray-200' : ''
//             }`}
//     >
//         {children}
//     </button>
// );
{/* <FloatingMenu
                        editor={editor}
                        tippyOptions={{ duration: 100, offset: [-40, 4] }}
                        className='bg-white border shadow-lg rounded-full px-2 py-1 flex space-x-1'
                    >
                        {[1, 2, 3].map(level => (
                            <FloatingButton
                                key={level}
                                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                                isActive={editor.isActive('heading', { level })}
                            >
                                H{level}
                            </FloatingButton>
                        ))}

                        <FloatingButton
                            onClick={() => toggleMark(editor, 'italic')}
                            isActive={editor.isActive('italic')}
                        >
                            <span className='italic'> I </span>
                        </FloatingButton>

                        <FloatingButton
                            onClick={() => toggleMark(editor, 'bold')}
                            isActive={editor.isActive('bold')}
                        >
                            <strong>B</strong>
                        </FloatingButton>

                        <FloatingButton
                            onClick={() => toggleMark(editor, 'underline')}
                            isActive={editor.isActive('underline')}
                        >
                            <u>U</u>
                        </FloatingButton>

                        <FloatingButton
                            onClick={() => toggleMark(editor, 'strike')}
                            isActive={editor.isActive('strike')}
                        >
                            <AiOutlineStrikethrough className="w-4 h-4" />
                        </FloatingButton>

                        <FloatingButton
                            onClick={setLink}
                            isActive={editor.isActive('link')}
                        >
                            <PiLinkBold className="w-4 h-4" />
                        </FloatingButton>

                        <FloatingButton
                            onClick={() => toggleMark(editor, 'code')}
                            isActive={editor.isActive('code')}
                        >
                            <PiCodeBold className="w-4 h-4" />
                        </FloatingButton>

                        <FloatingButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                        >
                            List
                        </FloatingButton>
                    </FloatingMenu> */}
