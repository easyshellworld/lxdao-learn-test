'use client';
import MDEditor from '@uiw/react-md-editor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useMarkdown } from "@/components/LearningContext";

export const MarkdownEditor = () => {
  const { markdown, setMarkdown } = useMarkdown(); // 直接使用全局状态

  return (
    <div className="w-full h-full">
      <MDEditor
        value={markdown}
        onChange={(newValue) => newValue !== undefined && setMarkdown(newValue)}
        components={{
          preview: (source) => <MarkdownViewer markdown={source} />
        }}
        preview="live"
        previewOptions={{
          rehypePlugins: [],
        }}
        height="100%"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      />
    </div>
  );
};
