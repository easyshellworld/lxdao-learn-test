'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

import 'katex/dist/katex.min.css'; // 数学公式样式
import 'highlight.js/styles/github.css'; // GitHub 代码高亮风格
import 'github-markdown-css/github-markdown-light.css'; // GitHub Markdown 样式

interface MarkdownViewerProps {
  markdown: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdown }) => {
  return (
    <div className="markdown-body p-4 rounded-lg border border-gray-200 bg-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
