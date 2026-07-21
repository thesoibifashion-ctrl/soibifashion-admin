import { EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

interface BlogContentProps {
  editor: Editor | null;
  title: string;
  onTitleChange: (title: string) => void;
  isLoading?: boolean;
}

export function BlogContent({ editor }: BlogContentProps) {
  return (
    <>
      <div className="rounded-md p-4 min-h-[80vh] w-full lg:w-[70vw] mx-auto  prose prose-gray">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
