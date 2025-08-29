import { jsx as _jsx } from "react/jsx-runtime";
import Spinner from "./Spinner"; // Spinner 컴포넌트가 있다고 가정
export default function Loader({ fullScreen = false }) {
    if (fullScreen) {
        return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-gray-50 bg-opacity-75", children: _jsx(Spinner, {}) }));
    }
    return (_jsx("div", { className: "flex w-full items-center justify-center p-8", children: _jsx(Spinner, {}) }));
}
