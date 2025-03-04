在nextjs 15 ts中 app route中，需要设计一个API为auth，需要利用./lib/github.ts里面函数readFile(path: string)读取一个远程仓库的`data/register.json`,通过wagmi提交并验证了eth地址作为key，来验证`register.json`中 "approvalStatus"属性来验证， "approved"则直接利用nextauth发放JWT，如果是`pending,rejected`返回`pending,rejected`,如果没有信息，返回没有的信息。

写一个nextjs 15 注册API，利用./lib/github.ts里面的函数authFile(path: string)读取原来`data/register.json`,转换JSON，然后根据./lib/github.ts里面的函数addAuth(
  path: string,
  content: string,
  message: string = "add user"
): Promise<void> ，根据page.tsx页面信息，"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
//import { updateBindings } from "@/lib/bindings";

export default function Register() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    timezone: "UTC+8", // Default timezone value
    bio: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    if (!address || !formData.name || !formData.email) return;
    // await updateBindings(address, { file: "README.md", ...formData });
    router.push("/dashboard/edit"); // 注册后直接跳转编辑页面
  };

  if (!isConnected) return <p>请连接钱包</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">报名信息</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          昵称 <span className="text-xs text-gray-500">(推荐使用英文格式)</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="请输入您的昵称"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          联系方式（推荐使用tg）
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="请输入您的邮箱地址"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="timezone" className="block text-sm font-medium mb-1">
          时区 <span className="text-xs text-gray-500">(默认 UTC+8)</span>
        </label>
        <input
          id="timezone"
          type="text"
          name="timezone"
          placeholder="例如: UTC+8"
          className="w-full border p-2 rounded"
          value={formData.timezone}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          自我介绍
        </label>
        <textarea
          id="bio"
          name="bio"
          placeholder="请简单介绍一下您自己"
          className="w-full border p-2 rounded"
          value={formData.bio}
          onChange={handleInputChange}
        />
      </div>
      
      <Button onClick={handleRegister} className="w-full">提交报名</Button>
    </div>
  );
}写入一个新对象，需要默认自动增加 "approvalStatus": "pending",register.json格式如下，同步修改page.tsx页面


"use client";

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';

export default function MarkdownEditor({ content, onSave }: { content: string; onSave: (newContent: string) => void }) {
  const [value, setValue] = useState(content);

  return (
    <div className="space-y-4">
      <MDEditor value={value} onChange={setValue} />
      <Button onClick={() => onSave(value)}>保存</Button>
    </div>
  );
}
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

结合以上两个组件/components/MarkdownEditor.tsx MarkdownViewer.tsx 写一个左边是编辑，右边预览的页面。数据来源，通过带jwt的状态访问API，然后利用钱包地址，通过/lib/github.ts的函数AuthFile(path: string)读取到文件名（以地址为索引，然后提取字段`file`,获取文件名），然后通过./lib/github.ts里面函数readFile(path: string)在读取文件，载入页面，点击保存按钮后，调用另外一个API，利用/lib/github.ts updateFile(
  path: string,
  content: string,
  message: string = "Update file"
): Promise<void> 根据原来获取的文件名，写入远程仓库。请完善页面，MarkdownEditor.tsx组件，以及两个API
