import './editor.css'

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import { PiLinkBold, PiCodeBold, PiTextAlignCenter, PiTextAlignJustify, PiTextAlignLeft, PiTextAlignRight } from "react-icons/pi";
import { AiOutlineStrikethrough } from "react-icons/ai";
import React, { Children, useCallback } from 'react'
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
import FontFamily from '@tiptap/extension-font-family'

import DropDownMenu from '../DropDownMenu';
import {FONT_OPTIONS} from './FontConfig'

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
            FontFamily.configure({
                types: ['textStyle']
            }),
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
        content: ``,
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

    const currentFont = editor?.getAttributes('textStyle').FontFamily || ''

    return (
        <div className="border-none p-4">
            {editor && (
                <>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&family=Mitr:wght@200;300;400;500;600;700&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Shadows+Into+Light&display=swap" rel="stylesheet"
                    />
                    
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
                        className="flex flex-nowrap w-max whitespace-nowrap bg-white border shadow-lg rounded-full px-2 py-1"
                    >
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className='w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-100 transition text-sm font-medium'
                        >
                            H1
                        </button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className='w-8 h-8 flex items-center justify-center   text-black rounded-full hover:bg-gray-100 transition text-sm font-medium'
                        >
                            H2
                        </button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className='w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-100 transition text-sm font-medium'
                        >
                            H3
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'italic')}
                            className={
                                `w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                ${editor.isActive('italic') ? 'bg-gray-200' : ''}`
                            }
                        >
                            𝐼
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'bold')}
                            className={`w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                        >
                            B
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'underline')}
                            className={`w-8 h-8 flex items-center justify-center underline text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
                        >
                            U
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'strike')}
                            className={`w-8 h-8 flex items-center justify-center  text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
                        >
                            <AiOutlineStrikethrough className='h-4 w-4' />
                        </button>
                        <button
                            onClick={setLink}
                            className={`w-8 h-8 flex items-center justify-center text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                ${editor.isActive('link') ? 'is-active' : ''}`}>
                            <PiLinkBold className='w-4 h-4' />
                        </button>
                        <button
                            onClick={() => toggleMark(editor, 'code')}
                            className={`w-8 h-8 flex items-center justify-center text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                ${editor.isActive('link') ? 'is-active' : ''}`}
                        >
                            <PiCodeBold className='w-4 h-4' />
                        </button>
                        {/* Font Dropdown (test) */}
                        <div className='h-8 p-2 flex items-center justify-center gap-2'>
                            <label className='text-sm font-medium '>Font</label>
                            <select 
                                value={currentFont}
                                onChange={(e) => {
                                    const font = e.target.value
                                    editor?.chain().focus().setFontFamily(font).run()
                                }}
                                className='text-sm px-2 py-1 border rounded hover:bg-gray-100 transition cursor-pointer'
                            >
                                {FONT_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        style={option.style}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='shrink-0 min-w-[2rem]'>
                            <DropDownMenu
                                label={<PiTextAlignJustify className='w-5 h-5' />}
                                items={[
                                    { label: <PiTextAlignLeft className='w-6 h-6' />, value: 'left' },
                                    { label: <PiTextAlignRight className='w-6 h-6' />, value: 'right' },
                                    { label: <PiTextAlignCenter className='w-6 h-6' />, value: 'center' },
                                    { label: <PiTextAlignJustify className='w-6 h-6' />, value: 'justify' },
                                ]}
                                onSelect={(val) => editor.chain().focus().setTextAlign(val).run()}
                            />
                        </div>
                    </FloatingMenu>

                </>
            )}

            <EditorContent editor={editor} className='className="tiptap prose prose-xl max-w-none"' />
        </div>
    )
}

export default Tiptap

