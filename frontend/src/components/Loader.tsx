// src/components/Loader.tsx

import React from "react";
import Spinner from "./Spinner"; // Spinner 컴포넌트가 있다고 가정

interface LoaderProps {
  fullScreen?: boolean;
}

export default function Loader({ fullScreen = false }: LoaderProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 bg-opacity-75">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center p-8">
      <Spinner />
    </div>
  );
}