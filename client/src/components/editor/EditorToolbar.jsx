import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
  Link as LinkIcon,
   Image as ImageIcon,
  Table as TableIcon,
  Plus,
  Trash2,
  
} from "lucide-react";

const EditorToolbar = ({ editor }) => {
  const [showTableMenu, setShowTableMenu] = useState(false);

  if (!editor) return null;

  const buttonClass = (active = false) =>
    `flex h-9 w-9 items-center justify-center rounded-md transition ${
      active
        ? "bg-indigo-100 text-indigo-600"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
    }`;


  return (
    
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2">

      {/* HEADING */}

      <select
        defaultValue="h1"
        onChange={(e) => {
          const value = e.target.value;

          if (value === "paragraph") {
            editor.chain().focus().setParagraph().run();
          }

          if (value === "h1") {
            editor.chain().focus().setHeading({ level: 1 }).run();
          }

          if (value === "h2") {
            editor.chain().focus().setHeading({ level: 2 }).run();
          }

          if (value === "h3") {
            editor.chain().focus().setHeading({ level: 3 }).run();
          }
        }}
        className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      {/* DIVIDER */}

      <div className="mx-1 h-6 w-px bg-slate-200" />

      {/* BOLD */}

      <button
        type="button"
        title="Bold"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={buttonClass(editor.isActive("bold"))}
      >
        <Bold size={18} />
      </button>

      {/* ITALIC */}

      <button
        type="button"
        title="Italic"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={buttonClass(editor.isActive("italic"))}
      >
        <Italic size={18} />
      </button>

      {/* UNDERLINE */}

      <button
        type="button"
        title="Underline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={buttonClass(editor.isActive("underline"))}
      >
        <Underline size={18} />
      </button>

      {/* LINK */}

      <button
        type="button"
        title="Link"
        onMouseDown={(e) => {
          e.preventDefault();

          const url = window.prompt("Enter URL:");

          if (!url) return;

          editor
            .chain()
            .focus()
            .setLink({ href: url })
            .run();
        }}
        className={buttonClass(editor.isActive("link"))}
      >
        <LinkIcon size={18} />
      </button>

      <div className="mx-1 h-6 w-px bg-slate-200" />
      {/* IMAGE */}

<input
  type="file"
  accept="image/*"
  id="image-upload"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl,
      })
      .run();

    e.target.value = "";
  }}
/>

<label
  htmlFor="image-upload"
  title="Insert Image"
  className={buttonClass()}
>
  <ImageIcon size={18} />
</label>
{/* TABLE MENU */}

<div className="relative">
  <button
    type="button"
    title="Table"
    onMouseDown={(e) => {
      e.preventDefault();
      setShowTableMenu((prev) => !prev);
    }}
    className={buttonClass()}
  >
    <TableIcon size={18} />
  </button>

  {showTableMenu && (
    <div className="absolute left-0 top-11 z-50 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">

      {/* INSERT TABLE */}

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();

          editor
            .chain()
            .focus()
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run();

          setShowTableMenu(false);
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        <TableIcon size={16} />
        Insert Table
      </button>

      <div className="my-1 border-t border-slate-100" />

      {/* ADD ROW */}

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addRowAfter().run();
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        <Plus size={16} />
        Add Row
      </button>

      {/* DELETE ROW */}

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteRow().run();
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        <Trash2 size={16} />
        Delete Row
      </button>

      {/* ADD COLUMN */}

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnAfter().run();
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        <Plus size={16} />
        Add Column
      </button>

      {/* DELETE COLUMN */}

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteColumn().run();
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        <Trash2 size={16} />
        Delete Column
      </button>

      <div className="my-1 border-t border-slate-100" />

      {/* DELETE TABLE */}

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteTable().run();
          setShowTableMenu(false);
        }}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 size={16} />
        Delete Table
      </button>
    </div>
  )}
</div>
      {/* BULLET LIST */}

     <button
  type="button"
  title="Bullet List"
  onMouseDown={(e) => {
    e.preventDefault();

    editor.chain().focus().toggleBulletList().run();
  }}
  className={buttonClass(editor.isActive("bulletList"))}
>
  <List size={18} />
</button>

      {/* NUMBERED LIST */}

      <button
  type="button"
  title="Numbered List"
  onMouseDown={(e) => {
    e.preventDefault();

    editor.chain().focus().toggleOrderedList().run();
  }}
  className={buttonClass(editor.isActive("orderedList"))}
>
  <ListOrdered size={18} />
</button>

      {/* QUOTE */}

      <button
        type="button"
        title="Quote"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={buttonClass(editor.isActive("blockquote"))}
      >
        <Quote size={18} />
      </button>

      {/* CODE */}

      <button
        type="button"
        title="Code Block"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }}
        className={buttonClass(editor.isActive("codeBlock"))}
      >
        <Code size={18} />
      </button>

      <div className="mx-1 h-6 w-px bg-slate-200" />

      {/* UNDO */}

      <button
        type="button"
        title="Undo"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        className={buttonClass()}
      >
        <Undo2 size={18} />
      </button>

      {/* REDO */}

      <button
        type="button"
        title="Redo"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        className={buttonClass()}
      >
        <Redo2 size={18} />
      </button>

    </div>
  );
};

export default EditorToolbar;