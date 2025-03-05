"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { status } = useSession();

  useEffect(() => {
    async function checkAuth() {
      if (isConnected && address) {
        try {
          const message = "login LxDao"; // 签名信息, 需要和后端保持一致
          const signature = await signMessageAsync({ message });

          const response = await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ address, signature }),
          });

          const data = await response.json();

          if (data.token) {
            // 使用nextAuth的signIn
            await signIn("credentials", {
              address,
              signature,
              redirect: false,
            });
          } else if (data.status === "pending") {
            router.push("/register/pending");
          } else if (data.status === "not_found") {
            router.push("/register");
          } else {
            console.error("Unknown status:", data.status);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    checkAuth();
  }, [isConnected, address, router, signMessageAsync]);

  useEffect(() => {
    if (status === 'authenticated' && isConnected && address ) {
      router.push('/dashboard');
    }
  }, [status, router,isConnected,address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-4xl font-bold">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/logo.webp" // 图片路径（放在 public 目录下）
          alt="LXDao Logo"  // 替代文本
          width={96}        // 图片宽度
          height={96}       // 图片高度
          priority          // 预加载，提升 LCP 性能
        />
      </div>

      {/* 标题 */}
      <h1 className="text-3xl font-bold mb-4">LXDao 残酷共学web3 DEMO测试系统</h1>

      {/* 提示文字 */}
      <p className="mb-6 text-gray-600">请连接钱包以继续</p>

      {/* 连接钱包按钮 */}
      <ConnectWallet />
    </div>
  );
}