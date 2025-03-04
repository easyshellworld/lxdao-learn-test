'use client';

import { useAccount } from 'wagmi';

export default function Pending() {
  const { address, isConnected } = useAccount();

  if (!isConnected) return <p>请连接钱包</p>;
  if (!address) return <p>钱包地址未找到</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">审核状态</h2>
      <p>钱包地址: {address}</p>
      <p>
        审核状态: <span className="font-semibold">正在审核中</span>
      </p>
    </div>
  );
}