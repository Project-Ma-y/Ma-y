import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createPortal } from "react-dom";
import Button from "@/components/button/Button";
import { useUIStore } from "@/store/uiStore";
export function Modal({ id, variant, title = "title", subtext = "subtext", children, confirmText = "button", onConfirm, showCancel = false, cancelText = "취소", acknowledgeLabel, }) {
    const isOpen = useUIStore((s) => s.isModalOpen(id));
    const close = useUIStore((s) => s.closeModal);
    const [ack, setAck] = useState(false);
    const requireAck = variant === "notice" && !!acknowledgeLabel;
    if (!isOpen)
        return null;
    const Icon = () => {
        if (variant === "success") {
            return (_jsx("span", { className: "inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E]", children: _jsx("svg", { className: "h-6 w-6 text-white", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z", clipRule: "evenodd" }) }) }));
        }
        // warning + notice -> 동일한 느낌의 느낌표
        return (_jsx("span", { className: "inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5A36]", children: _jsx("svg", { className: "h-6 w-6 text-white", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M11 6h2v8h-2zM11 16h2v2h-2z" }) }) }));
    };
    const Card = ({ children: c }) => (_jsx("div", { className: "relative z-10 w-full max-w-md rounded-3xl bg-white p-4", children: _jsx("div", { className: "rounded-2xl bg-gray-100 p-6 shadow-[0_2px_0_#e5e5e5_inset]", children: c }) }));
    const handleConfirm = () => {
        onConfirm?.();
        close(id);
    };
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: () => close(id) }), _jsx(Card, { children: _jsxs("div", { className: "flex flex-col items-center text-center gap-4", children: [_jsx(Icon, {}), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", children: title }), subtext && _jsx("div", { className: "mt-1 text-sm text-gray-500", children: subtext })] }), variant === "notice" && (_jsxs("div", { className: "mt-2 text-gray-600", children: [children, acknowledgeLabel && (_jsxs("label", { className: "mt-4 flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-gray-400", checked: ack, onChange: (e) => setAck(e.target.checked) }), acknowledgeLabel] }))] })), _jsxs("div", { className: "mt-2 flex w-full items-center justify-center gap-3", children: [showCancel && (_jsx(Button, { type: "secondary", buttonName: cancelText, onClick: () => close(id) })), _jsx(Button, { type: variant === "warning" ? "primary" : "default", buttonName: confirmText, onClick: handleConfirm, disabled: requireAck && !ack, className: variant === "notice" ? "bg-[#8B8B8B] text-[#CDCDCD] border-none data-[enabled=true]:bg-[var(--color-primary)] data-[enabled=true]:text-white" : "" })] })] }) })] }), document.body);
}
export default Modal;
