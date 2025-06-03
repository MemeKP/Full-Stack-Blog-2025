import React, { useEffect, useRef, useState } from 'react'

const DropDownMenu = ({
    label = 'select',
    items = [], // [{ label: "Heading 1", value: "h1" }]
    onSelect = () => { }, //callback
    className = '', // custom class

}) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-menu')) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className={`relative px-2 inline-block text-left ${className}`} ref={menuRef}>
            <div>
                <button
                    type="button"
                    className="dropdown-menu h-9 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    onClick={() => setOpen(prev => !prev)}
                >
                    {/* {label} */}
                    {/* Show icon or text label */}
                    {typeof label === 'string' ? <span>{label}</span> : label}
                    
                    <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fillRule="currentColor" aria-hidden="true" data-slot="icon">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {open && (
                <div className="absolute z-10 mt-2 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="py-1" role="none">
                        {items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    onSelect(item.value)
                                    setOpen(false)
                                }}
                                className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                                style={item.style || {}}
                            >
                                {typeof item.label === 'string' ? <span>{item.label}</span> : item.label}
                                {/* {items.label} */}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default DropDownMenu