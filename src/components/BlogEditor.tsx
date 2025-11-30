"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useCallback } from "react";

export default function BlogEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg focus:outline-none max-w-full",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="border rounded-lg mt-1">
      {editor && (
        <div className="flex gap-2 border-b p-2 bg-gray-50 text-sm">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 font-bold ${editor.isActive("bold") ? "bg-primary text-primary-foreground rounded" : ""}`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 italic ${editor.isActive("italic") ? "bg-primary text-primary-foreground rounded" : ""}`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 underline ${editor.isActive("underline") ? "bg-primary text-primary-foreground rounded" : ""}`}
          >
            U
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`px-2 ${editor.isActive("link") ? "bg-primary text-primary-foreground rounded" : ""}`}
          >
            Link
          </button>
        </div>
      )}
      <EditorContent editor={editor} className="p-4 min-h-[300px]" />
    </div>
  );
}
