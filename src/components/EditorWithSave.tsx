import React, { useState, useRef, useEffect } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';

interface EditorWithSaveProps {
  initialMarkdown?: string;
  address?: string;
}

const EditorWithSave: React.FC<EditorWithSaveProps> = ({
  initialMarkdown,
  address,
}) => {
  const [markdown, setMarkdown] = useState(initialMarkdown || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    setMarkdown(initialMarkdown || '');
  }, [initialMarkdown]);

/*   useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []); */

  const handleSave = async () => {
    if (!address || isSaving || !isMounted.current) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/save?address=${address}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown }),
      });

      if (response.ok && isMounted.current) {
        setSaveSuccess(true);
        setTimeout(() => {
          if (isMounted.current) setSaveSuccess(false);
        }, 3000);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4">
        <MarkdownEditor value={markdown} onChange={setMarkdown} />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
        {error && ( // Display the error message
          <div className="text-red-500 mt-2">{error}</div>
        )}
      </div>
      <div className="w-1/2 p-4 border-l">
        <MarkdownViewer markdown={markdown} />
      </div>

      {saveSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            保存成功!
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorWithSave;