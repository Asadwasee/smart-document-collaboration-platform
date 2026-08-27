import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {Table} from "@tiptap/extension-table";
import {TableRow} from "@tiptap/extension-table-row";
import {TableHeader} from "@tiptap/extension-table-header";
import {TableCell} from "@tiptap/extension-table-cell";

import EditorToolbar from "./EditorToolbar";

const RichTextEditor = () => {
  const editor = useEditor({
  extensions: [
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
    }),
    Image,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],

  content: `
    <p>Start writing your document here...</p>
  `,
});

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <EditorToolbar editor={editor} />

      <div className="min-h-[400px] p-6">
        <EditorContent
  editor={editor}
  className="tiptap"
/>
      </div>
    </div>
  );
};

export default RichTextEditor;