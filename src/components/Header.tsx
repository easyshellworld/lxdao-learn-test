'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAccount, useDisconnect } from 'wagmi';
import { signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";

export function Header() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const handleLogout = async () => {
    
        await disconnect();
        await signOut();
        router.push('/'); 
    
  };

  return (
    <header className="sticky top-0 bg-white border-b z-50 py-4">
    <div className="container flex flex-col items-center">
    
        <div className="flex items-center justify-center mb-2">
          <Image src="/logo.webp" alt="LxDao Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold ml-2">LxDao残酷共学demo系统</h1>
        </div>
      <nav className="flex items-center space-x-4">
        <Link
          href="/progress"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          学习进度
        </Link>
        <Link
          href="/resources"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          学习资源
        </Link>
        <Link
          href="/notes"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          其他共学笔记
        </Link>
        <Link
          href="/edit"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          编辑笔记
        </Link>
        {isConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-blue-600 border-blue-600 hover:bg-blue-100 transition-colors duration-200"
          >
            登出钱包
          </Button>
        )}
      </nav>
    </div>
  </header>
  );
}