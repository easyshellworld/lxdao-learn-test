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
    <div className="flex flex-col h-screen">
      {/* 主体部分（编辑器 & 预览器） */}
      <div className="flex w-full flex-grow">
        {/* 编辑区 */}
        <div className="w-1/2 p-4 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 flex flex-col">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
        </div>

        {/* 预览区 */}
        <div className="w-1/2 p-4 border-l flex flex-col min-h-0">
          <div className="flex-1 min-h-0 flex flex-col">
            <MarkdownViewer markdown={markdown} />
          </div>
        </div>
      </div>

      {/* 保存按钮区域 */}
      <div className="flex justify-center p-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
        {error && <div className="text-red-500 ml-4">{error}</div>}
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