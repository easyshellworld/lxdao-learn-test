'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useSession } from 'next-auth/react';


export default function Edit() {
  const { address, isConnected } = useAccount();
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const isMounted = useRef<boolean>(true);

  // 组件卸载时标记 isMounted 为 false
/*   useEffect(() => {
    return () => {
      isMounted.current = false;
     
    };
  }, []); */

  // 如果未连接钱包或未认证，跳转到首页
  useEffect(() => {
   if (!isConnected || sessionStatus !== 'authenticated'){
      router.push('/');
    }
  }, [isConnected, sessionStatus, router]);

  // 获取数据
  useEffect(() => {
    if (!address || sessionStatus !== 'authenticated' ) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/file?address=${address}`);

        if (response.ok) {
          const data = await response.json();
        if (isMounted.current) {
            setMarkdown(data.content);
          }
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
      } finally {
        console.log(isMounted.current)
       if (isMounted.current) {
          setLoading(false);
       }
      }
    };

    fetchData();
  }, [address, sessionStatus]);

  // 保存数据
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
        }, 3000); // 3秒后隐藏成功提示
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

      {/* 保存成功提示（居中显示） */}
      {saveSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            保存成功!
          </div>
        </div>
      )}
    </div>
  );
}