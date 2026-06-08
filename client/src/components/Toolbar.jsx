
import {
  MdFormatBold, MdFormatItalic, MdFormatUnderlined,
  MdFormatListBulleted, MdFormatListNumbered,
  MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight
} from 'react-icons/md'

const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const btn = (action, isActive, icon, title) => (
    <button
      key={title}
      title={title}
      onMouseDown={(e) => { e.preventDefault(); action(); }}
      className={`p-1.5 rounded hover:bg-[#3A506A]/60 transition-colors ${
        isActive ? 'bg-[#3A506A] text-black' : 'text-black'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-wrap justify-center items-center gap-0.5 px-4 py-2">
      {btn(() => editor.chain().focus().toggleBold().run(),        editor.isActive('bold'),       <MdFormatBold size={18}/>,        'Bold')}
      {btn(() => editor.chain().focus().toggleItalic().run(),      editor.isActive('italic'),     <MdFormatItalic size={18}/>,      'Italic')}
      {btn(() => editor.chain().focus().toggleUnderline().run(),   editor.isActive('underline'),  <MdFormatUnderlined size={18}/>,  'Underline')}

      <div className="w-px h-5 bg-[#3A506A]/60 mx-1" />

      {[1, 2, 3].map(level => btn(
        () => editor.chain().focus().toggleHeading({ level }).run(),
        editor.isActive('heading', { level }),
        <span className="text-xs font-bold px-0.5">H{level}</span>,
        `Heading ${level}`
      ))}

      <div className="w-px h-5 bg-[#3A506A]/60 mx-1" />

      {btn(() => editor.chain().focus().toggleBulletList().run(),  editor.isActive('bulletList'),  <MdFormatListBulleted size={18}/>,  'Bullet list')}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), <MdFormatListNumbered size={18}/>,  'Numbered list')}

      <div className="w-px h-5 bg-[#3A506A]/60 mx-1" />

      {btn(() => editor.chain().focus().setTextAlign('left').run(),   editor.isActive({ textAlign: 'left' }),   <MdFormatAlignLeft size={18}/>,   'Align left')}
      {btn(() => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), <MdFormatAlignCenter size={18}/>, 'Align center')}
      {btn(() => editor.chain().focus().setTextAlign('right').run(),  editor.isActive({ textAlign: 'right' }),  <MdFormatAlignRight size={18}/>,  'Align right')}
    </div>
  );
};

export default Toolbar;