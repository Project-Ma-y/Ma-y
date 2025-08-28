// src/components/Input.tsx
import React, { FC, InputHTMLAttributes } from 'react';

// Input 컴포넌트의 Props 타입을 확장하여 helpText를 추가합니다.
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: string;
}

const Input: FC<InputProps> = ({ label, helpText, ...rest }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFB014] focus:border-transparent transition duration-200"
        {...rest}
      />
      {helpText && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default Input;
