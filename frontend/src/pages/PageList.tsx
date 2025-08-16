import React from 'react';
import { pageList } from '../config';

const PageList = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📄 Page List</h2>
      <ul className="space-y-2">
        {pageList.map((page) => (
          <li key={page.path}>
            <a
              href={page.path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {page.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageList;
