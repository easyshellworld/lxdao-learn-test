import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

export const MarkdownEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [preview, setPreview] = useState<'edit' | 'preview'>('edit');

  return (
    <MDEditor
      value={value}
      onChange={onChange}
      preview={preview}
      previewOptions={{
        rehypePlugins: [],
      }}
      height={500}
    />
  );
};