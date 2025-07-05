import './editor.css'

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import { PiLinkBold, PiCodeBold, PiTextAlignCenter, PiTextAlignJustify, PiTextAlignLeft, PiTextAlignRight } from "react-icons/pi";
import { AiOutlineStrikethrough } from "react-icons/ai";
import React, { useCallback, useEffect, useState } from 'react'
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
import TextAlign from '@tiptap/extension-text-align'
import { FONT_OPTIONS } from './FontConfig'

// กำหนด Editor
const PageEditor = ({ onChange }) => {
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
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
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

    /*Font Update */
    // const currentFont = editor?.getAttributes('textStyle').FontFamily || ''
    const [currentFont, setCurrentFont] = useState('');
    useEffect(() => {
        if (!editor) return;

        const updateFont = () => {
            const font = editor.getAttributes('textStyle').fontFamily || '';
            setCurrentFont(font);
        };

        editor.on('selectionUpdate', updateFont);
        editor.on('transaction', updateFont); // สำคัญมากเวลาเปลี่ยน font

        updateFont(); // set initial

        return () => {
            editor.off('selectionUpdate', updateFont);
            editor.off('transaction', updateFont);
        };
    }, [editor]);

    /*Align Update */
    const [selected, setSelected] = useState('justify');
    const handleSelect = (val) => {
        setSelected(val);
        editor.chain().focus().setTextAlign(val).run();
    };

    if (!editor) {
        return null
    }

    return (
        <div className='tiptap w-full border-none overflow-visible relative px-4'>

            {editor && (
                <>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&family=Mitr:wght@200;300;400;500;600;700&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Shadows+Into+Light&display=swap" rel="stylesheet"
                    />
                    {/* Do as Floating Menu */}
                    <BubbleMenu
                        editor={editor}
                        tippyOptions={{
                            placement: "top",
                            duration: 100,
                            boundary: "clippingParents",
                            rootBoundary: "document",
                            modifiers: [
                                {
                                    name: "offset",
                                    options: {
                                        offset: [0, 12],
                                    },
                                },
                                {
                                    name: "preventOverflow",
                                    options: {
                                        padding: 8,
                                        boundary: "clippingParents",
                                        tether: false,
                                    },
                                },
                                {
                                    name: "flip",
                                    options: {
                                        fallbackPlacements: ["top", "bottom"],
                                    },
                                },
                            ],
                        }}
                        className="flex w-max flex-nowrap md:overflow-x-auto whitespace-nowrap bg-white border shadow-lg rounded-full px-2 gap-2 py-1 z-50"
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
                        <div className="control-group flex">
                            <div className="button-group flex">
                                <button
                                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                    className={`w-8 h-8 flex items-center justify-center text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                        ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
                                >
                                    <PiTextAlignLeft className='w-4 h-4' />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                    className={`w-8 h-8 flex items-center justify-center text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                        ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}                                >
                                    <PiTextAlignCenter className='w-4 h-4' />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                    className={`w-8 h-8 flex items-center justify-center text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                        ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}                                >
                                    <PiTextAlignRight className='w-4 h-4' />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                    className={`w-8 h-8 flex items-center justify-center text-black rounded-full hover:bg-gray-100 transition text-sm font-medium
                                        ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`}                                >
                                    <PiTextAlignJustify className='w-4 h-4' />
                                </button>

                            </div>
                        </div>
                        {/* Font Dropdown (test) */}
                        <div className='relative h-8 px-2 text-left inline-block gap-2'>
                            <label className='sr-only'>Font</label>
                            <select
                                value={currentFont}
                                onChange={(e) => {
                                    const font = e.target.value
                                    editor?.chain().focus().setFontFamily(font).run()
                                }}
                                className='inline-flex w-full h-8 justify-center items-center gap-x-1.5 rounded-md bg-white px-2 text-sm font-medium text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 cursor-pointer appearance-none focus:outline-none'
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
                            <div className='absolute pointer-events-none inset-y-5 right-3 flex items-center justify-center'>
                                <svg className="h-5 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </BubbleMenu>

                </>
            )}
            <EditorContent editor={editor} />
        </div>
    )
}

export default PageEditor