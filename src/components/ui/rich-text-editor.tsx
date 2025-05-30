'use client';

import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange(newValue);
  };

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        <button
          type="button"
          className="p-2 text-gray-600 hover:bg-gray-200 rounded"
          onClick={() => {
            const textarea = document.querySelector('textarea');
            if (textarea) {
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = content;
              const newText = text.substring(0, start) + '**' + text.substring(start, end) + '**' + text.substring(end);
              setContent(newText);
              onChange(newText);
            }
          }}
        >
          Bold
        </button>
        <button
          type="button"
          className="p-2 text-gray-600 hover:bg-gray-200 rounded"
          onClick={() => {
            const textarea = document.querySelector('textarea');
            if (textarea) {
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = content;
              const newText = text.substring(0, start) + '_' + text.substring(start, end) + '_' + text.substring(end);
              setContent(newText);
              onChange(newText);
            }
          }}
        >
          Italic
        </button>
        <button
          type="button"
          className="p-2 text-gray-600 hover:bg-gray-200 rounded"
          onClick={() => {
            const textarea = document.querySelector('textarea');
            if (textarea) {
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = content;
              const newText = text.substring(0, start) + '\n- ' + text.substring(start, end) + text.substring(end);
              setContent(newText);
              onChange(newText);
            }
          }}
        >
          List
        </button>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Start typing..."
      />
    </div>
  );
} 