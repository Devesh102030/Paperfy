"use client";
import { useState } from 'react';

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-full w-48 bg-white border-r border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 z-40">
      <div className="p-4 h-full overflow-y-auto">
        <h2 className="text-xl font-semibold dark:text-white">Application</h2>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <a href="/home" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700 rounded">
                Home
              </a>
            </li>
            <li>
              <a href="/mypapers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700 rounded">
                My Papers
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}