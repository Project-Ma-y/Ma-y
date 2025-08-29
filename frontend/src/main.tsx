import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/assets/style/index.css';
import { initializeAuthListener } from '@/services/firebase';

// Firebase 인증 상태 리스너를 앱 시작 시 한 번만 초기화합니다.
initializeAuthListener();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
