'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { ScrollArea } from "@/components/ui/scroll-area";

import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import 'github-markdown-css/github-markdown-light.css';

interface MarkdownViewerProps {
  markdown: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdown }) => {
  return (
    <div className="w-full h-full">
      <ScrollArea className="h-full w-full border border-gray-200 rounded-lg">
        <div className="markdown-body p-4">
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
              ol: ({ children, ...props }) => (
                <ol className="list-decimal pl-6" {...props}>
                  {children}
                </ol>
              ),
              ul: ({ children, ...props }) => (
                <ul className="list-disc pl-6" {...props}>
                  {children}
                </ul>
              )
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
};