'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
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
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  // 如果未连接钱包或未认证，跳转到首页
  useEffect(() => {
    if (!isConnected || sessionStatus !== 'authenticated') {
      router.push('/');
    }
  }, [isConnected, sessionStatus, router]);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      if (!address || sessionStatus !== 'authenticated') return;

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
  }, [address, sessionStatus]);

  // 保存数据
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
        setTimeout(() => setSaveSuccess(false), 3000); // 3秒后隐藏成功提示
      } else {
        throw new Error('Failed to save data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-4xl font-bold">LOADING...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );
  }

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