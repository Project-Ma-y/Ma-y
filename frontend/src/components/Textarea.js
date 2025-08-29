import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import clsx from 'clsx';
export const Textarea = forwardRef(({ className, invalid, ...rest }, ref) => {
    return (_jsx("textarea", { ref: ref, className: clsx('min-h-[120px] w-full rounded-2xl border bg-white p-3 text-sm outline-none transition', invalid ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-black/20', className), ...rest }));
});
Textarea.displayName = 'Textarea';
export default Textarea;
