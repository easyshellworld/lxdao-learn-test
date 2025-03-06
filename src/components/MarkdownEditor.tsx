'use client';
import MDEditor from '@uiw/react-md-editor';

export const MarkdownEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  return (
    <div className="w-full h-full">
      <MDEditor
        value={value}
        onChange={(newValue) => newValue !== undefined && onChange(newValue)}
        preview="edit"
        previewOptions={{ rehypePlugins: [] }}
        height="100%"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        // 不指定额外的样式，使用编辑器自带的滚动功能
      />
    </div>
  );
};