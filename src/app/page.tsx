"use client";

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
  const {/*  data: session, */status } = useSession(); // 获取session信息


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

          if (data.token ) {
            // 使用nextAuth的signIn
            signIn("credentials", {
              address,
              signature,
              redirect: false,
            });
            if (status === 'authenticated') {
              router.push('/dashboard');
            }
          } else if (data.status === "pending") {
            router.push("/register/pending");
          } 
           else if (data.status === "not_found") {
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
  }, [isConnected, address, router, signMessageAsync,status]);

  if (loading) return <p className="text-center mt-6">加载中...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">LXDao 残酷共学web3 DEMO测试系统</h1>
      <p className="mb-6 text-gray-600">请连接钱包以继续</p>
      <ConnectWallet />
    </div>
  );
}