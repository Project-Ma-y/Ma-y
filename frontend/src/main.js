import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/assets/style/index.css';
import { initializeAuthListener } from '@/services/firebase';
// Firebase 인증 상태 리스너를 앱 시작 시 한 번만 초기화합니다.
initializeAuthListener();
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
