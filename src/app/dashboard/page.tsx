'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
/* import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer'; */
import { useSession } from 'next-auth/react';
import EditorWithSave from '@/components/EditorWithSave'; 



export default function Edit() {
  const { address, isConnected,isConnecting } = useAccount();
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
   if (((!isConnected && isConnecting) || sessionStatus === 'unauthenticated') && !loading){
      router.push('/');
    }
  }, [isConnected, sessionStatus, router,loading,isConnecting]);

  // 获取数据
  useEffect(() => {
    if (!address || sessionStatus !== 'authenticated' || isConnecting ) return;

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
  }, [address, sessionStatus,isConnecting]);



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
    <div>
      <EditorWithSave initialMarkdown={markdown} address={address} />
     
    </div>
  );
}