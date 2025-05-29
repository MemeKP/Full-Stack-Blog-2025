import {PiTextAlignCenter, PiTextAlignJustify, PiTextAlignLeft, PiTextAlignRight } from "react-icons/pi";

export const TEXT_ALIGN_OPTIONS = [
  { label: <PiTextAlignLeft className="w-6 h-6" />, value: 'left' },
  { label: <PiTextAlignRight className="w-6 h-6" />, value: 'right' },
  { label: <PiTextAlignCenter className="w-6 h-6" />, value: 'center' },
  { label: <PiTextAlignJustify className="w-6 h-6" />, value: 'justify' },
];

export const ALIGN_ICONS = {
  left: <PiTextAlignLeft className="w-5 h-5" />,
  right: <PiTextAlignRight className="w-5 h-5" />,
  center: <PiTextAlignCenter className="w-5 h-5" />,
  justify: <PiTextAlignJustify className="w-5 h-5" />,
};