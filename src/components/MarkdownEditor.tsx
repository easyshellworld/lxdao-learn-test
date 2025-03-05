'use client';
/* import { useEffect, useRef } from 'react'; */
import MDEditor from '@uiw/react-md-editor';

export const MarkdownEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <MDEditor
        value={value}
        onChange={(newValue) => newValue !== undefined && onChange(newValue)}
        preview="edit"
        previewOptions={{ rehypePlugins: [] }}
        style={{ flex: 1, width: '100%', overflow: 'hidden' }}
      />
    </div>
  );
};
