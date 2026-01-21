'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AlertCircle } from 'lucide-react';

import type ReactQuillType from 'react-quill-new';

// Dynamically import to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const mod = await import('react-quill-new');
    return mod.default;
  },
  { ssr: false }
) as unknown as typeof ReactQuillType;

import 'react-quill-new/dist/quill.snow.css';

interface DetailedDescriptionProps {
  onDescriptionChange: (description: string) => void;
  minWords: number;
}

export default function DetailedDescription({
  onDescriptionChange,
  minWords,
}: DetailedDescriptionProps) {
  const [description, setDescription] = useState('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = description.replace(/<[^>]*>/g, '').trim().split(/\s+/);
    const count = words.length === 1 && words[0] === '' ? 0 : words.length;
    setWordCount(count);
    onDescriptionChange(description);
  }, [description, onDescriptionChange]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'script',
    'indent',
    'align',
    'link', 'image', 'video',
    'color', 'background',
    'blockquote', 'code-block',
  ];

  const isWordCountValid = wordCount >= minWords;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Detailed Description
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Provide comprehensive details about your product
          </p>
        </div>
        
        <div className={`flex items-center gap-2 ${
          isWordCountValid ? 'text-green-600' : 'text-red-600'
        }`}>
          <AlertCircle size={16} />
          <span className="font-medium">
            {wordCount} / {minWords} words
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Word Count Warning */}
        {!isWordCountValid && wordCount > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Minimum {minWords} words required. Add {minWords - wordCount} more words.
            </p>
          </div>
        )}

        {/* Editor */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={modules}
            formats={formats}
            placeholder="Write a detailed description of your product..."
            className="h-64"
          />
        </div>

        {/* Description Guidelines */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Description Guidelines:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Include materials, fabric type, and quality</li>
            <li>Describe the fit, sizing, and measurements</li>
            <li>Mention care instructions and maintenance</li>
            <li>Highlight unique features and craftsmanship</li>
            <li>Specify any customization options available</li>
            <li>Include shipping and delivery information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}