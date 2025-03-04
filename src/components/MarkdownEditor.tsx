import { useState, ChangeEvent } from 'react';
import MDEditor, { ContextStore } from '@uiw/react-md-editor';

export const MarkdownEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [preview] = useState<'edit' | 'preview'>('edit');

  const handleChange = (newValue: string | undefined, event?: ChangeEvent<HTMLTextAreaElement> | undefined, state?: ContextStore | undefined) => {
    if (newValue !== undefined) {
      console.log('Event:', event);
      console.log('State:', state);
      onChange(newValue);
    }
  };

  return (
    <MDEditor
      value={value}
      onChange={handleChange}
      preview={preview}
      previewOptions={{
        rehypePlugins: [],
      }}
      height={500}
    />
  );
};