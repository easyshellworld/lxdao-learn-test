'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useSession } from 'next-auth/react';

export default function Edit() {
  const { address, isConnected } = useAccount();
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const session = useSession();
  

  useEffect(() => {
    const fetchData = async () => {
      if (!address && session.status!='authenticated') return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/file?address=${address}`);

        if (response.ok) {
          const data = await response.json();
          setMarkdown(data.content);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const handleSave = async () => {
    if (!address || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/save?address=${address}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown }),
      });

      if (response.ok) {
        setSaveSuccess(true);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isConnected) return <p>请连接钱包</p>;
  if (loading) return <p>加载中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4">
        <MarkdownEditor value={markdown} onChange={setMarkdown} />
        <button onClick={handleSave} disabled={isSaving} className="bg-blue-500 text-white p-2 rounded mt-4">
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>
      <div className="w-1/2 p-4 border-l">
        <MarkdownViewer markdown={markdown} />
      </div>

      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md">
          保存成功!
        </div>
      )}
    </div>
  );
}
