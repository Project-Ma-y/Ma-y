import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/assets/style/index.css';
import { useUserStore } from '@/store/userStore.ts';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter를 import 합니다.
import { getAuth } from 'firebase/auth';
import { app as firebaseApp } from '@/services/firebase';
import { initializeUser } from '@/store/userStore.ts';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);

// Firebase Auth 인스턴스 초기화
const auth = getAuth(firebaseApp);

// 앱 시작 시 한 번만 사용자 상태 초기화
// 이 함수는 onAuthStateChanged 리스너를 설정하고, 사용자 상태를 업데이트합니다.
initializeUser(auth);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
