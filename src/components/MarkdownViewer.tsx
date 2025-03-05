'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown-light.css';

interface MarkdownViewerProps {
  markdown: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdown }) => {
  return (
    <div className="markdown-body p-4 rounded-lg border border-gray-200 bg-white">
      <ReactMarkdown
        remarkPlugins={[
          [remarkGfm, { singleTightList: false }], 
          remarkBreaks,
          remarkMath
        ]}
        rehypePlugins={[
          rehypeKatex,
          rehypeRaw,
          rehypeHighlight
        ]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ol: ({node, ...props}) => <ol className="list-decimal pl-6" {...props} />,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ul: ({node, ...props}) => <ul className="list-disc pl-6" {...props} />
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}