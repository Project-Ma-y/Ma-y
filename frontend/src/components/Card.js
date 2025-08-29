import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
export function Card({ className, ...rest }) {
    return _jsx("div", { className: clsx('rounded-3xl border border-gray-200 bg-white p-5 shadow-sm', className), ...rest });
}
export default Card;
