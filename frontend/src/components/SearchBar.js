import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search } from "lucide-react"; // npm i lucide-react 필요
import Button from "@/components/button/Button";
const SearchBar = ({ placeholder = "검색어를 입력하세요", onSearch, }) => {
    const [query, setQuery] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.(query);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "flex w-full max-w-xl items-center rounded-2xl bg-gray-100 p-2", children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: placeholder, className: "flex-1 bg-transparent px-3 text-base text-gray-700 placeholder-gray-400 focus:outline-none" }), _jsx(Button, { type: "submit", className: "ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:opacity-90", children: _jsx(Search, { size: 18 }) })] }));
};
export default SearchBar;
