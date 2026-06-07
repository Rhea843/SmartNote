import { useState, useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { MdMoreHoriz } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { FiArchive } from "react-icons/fi";
import { MdOutlinePushPin } from "react-icons/md";
import Toolbar from './Toolbar'
import useClickOutside from '../hooks/useClickOutside';

const NoteForm = ({ selectedNote, onCreate, onUpdate, moveToTrash, onClose, onAddTag, onRemoveTag, allTags, onTogglePin, onToggleArchive }) => {
  const [title, setTitle] = useState(selectedNote?.title || '')
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTagPanel, setShowTagPanel] = useState(false);

  const formRef = useRef(null)
  const titleRef = useRef(title);
  const isDirtyRef = useRef(false); 

  const moreMenuRef = useRef(null);
  const closeMoreMenu = useCallback(() => setActiveMenu(null), []);
  useClickOutside(moreMenuRef, closeMoreMenu);

  const tagPanelRef = useRef(null);
  const closeTagPanel = useCallback(() => setShowTagPanel(false), []);
  useClickOutside(tagPanelRef, closeTagPanel);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: selectedNote?.content || '',
    editorProps: {
      attributes: {
        class: 'min-h-[400px] p-4 focus:outline-none [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6',
      },
    },
    onUpdate: () => {
      isDirtyRef.current = true; // mark as dirty when editor content changes
    },
  });

  // Mark dirty when title changes
  useEffect(() => {
    isDirtyRef.current = true;
  }, [title]);

  // Sync editor content when selectedNote changes
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(selectedNote?.content || '');
    setTitle(selectedNote?.title || '');
    titleRef.current = selectedNote?.title || '';
    isDirtyRef.current = false; 
  }, [editor, selectedNote?.id]);

  
  useEffect(() => { titleRef.current = title; }, [title]);

 
  useEffect(() => {
  const interval = setInterval(async () => {
    if (!isDirtyRef.current) return;

    const latestTitle = titleRef.current;
    const latestContent = editor?.getHTML() ?? '';

    try {
      if (selectedNote) {
        await onUpdate(
          selectedNote.id,
          latestTitle,
          latestContent
        );
      } else {
        if (latestTitle || latestContent !== '<p></p>') {
          await onCreate(
            latestTitle,
            latestContent
          );
        }
      }

      isDirtyRef.current = false;
    } catch (error) {
      console.error(error);
    }
  }, 3000);

  return () => clearInterval(interval);
}, [selectedNote, onCreate, onUpdate, editor]);


  // Save on unmount if still dirty
  useEffect(() => {
    return () => {
      if (!isDirtyRef.current) return;
      const latestTitle = titleRef.current;
      const latestContent = editor?.getHTML() ?? '';
      if (selectedNote) {
        onUpdate(selectedNote.id, latestTitle, latestContent);
      } else if (latestTitle || latestContent !== '<p></p>') {
        onCreate(latestTitle, latestContent);
      }
    };
  }, []);

  // Click outside → close (saving is handled by autosave)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('[data-no-close]')) return;
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div ref={formRef} className='flex flex-col relative w-full h-full'>

      <button
        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'form' ? null : 'form') }}
        className='absolute top-4 lg:right-10 right-6 bg-[#3A506A] p-2 rounded-full w-10 h-10 flex items-center justify-center'
      >
        <MdMoreHoriz className="text-2xl" />
      </button>

      <button onClick={onClose} className="lg:hidden absolute top-4 md:left-8 left-4 text-2xl">
        <IoArrowBack />
      </button>

      <div className='flex flex-col items-center w-full mt-14 px-4'>
        <p className="text-sm text-gray-400">
          {selectedNote?.updated_at ? formatDate(new Date(selectedNote.updated_at)) : formatDate(currentDate)}
        </p>


        {selectedNote?.tags?.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-4'>
            {selectedNote.tags.map(tag => (
              <div key={tag.id} className='bg-[#3A506A] text-[#fafafa] text-xs px-3 py-2 rounded-md'>
                <span className='flex items-center gap-1'><IoPricetagsOutline />{tag.name}</span>
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='text-2xl text-center font-semibold mt-6 focus:outline-none w-full bg-transparent'
        />
      </div>

      <div className='mt-4 flex flex-col flex-1'>
        <Toolbar editor={editor} />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
      </div>

      {showTagPanel && selectedNote && (
        <div ref={tagPanelRef} className='bg-[#415A77] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)] absolute top-15 lg:right-15 right-9 w-48 z-50 flex flex-col p-3'>
          <p className='text-sm font-semibold mb-2'>Add to tag</p>
          {allTags?.length > 0 ? allTags.map(tag => {
            const isAdded = selectedNote.tags?.some(t => t.id === tag.id);
            return (
              <button
                key={tag.id}
                onClick={(e) => { e.stopPropagation(); isAdded ? onRemoveTag(selectedNote.id, tag.id) : onAddTag(selectedNote.id, tag.id); }}
                className={`flex items-center gap-2 px-2 py-2 rounded text-sm w-full text-left ${isAdded ? 'bg-[#1B263B] text-white' : 'hover:bg-[#1B263B]/40'}`}
              >
                <IoPricetagsOutline />{tag.name}
              </button>
            );
          }) : <p className='text-xs text-gray-300'>No tags yet.</p>}
        </div>
      )}

      {activeMenu === 'form' && (
        <div ref={moreMenuRef} className='bg-[#415A77] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)] absolute top-15 lg:right-15 right-9 w-48 z-50 flex flex-col'>
          <button
            onClick={(e) => { e.stopPropagation(); if (selectedNote) onTogglePin(selectedNote.id); onClose(); setActiveMenu(null); }}
            className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'
          >
            <MdOutlinePushPin />{selectedNote?.is_pinned ? 'Unpin Note' : 'Pin Note'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowTagPanel(!showTagPanel); setActiveMenu(null); }}
            className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'
          >
            <IoPricetagsOutline className='text-xl' /><p>Tag note</p>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (selectedNote) onToggleArchive(selectedNote.id); onClose(); setActiveMenu(null); }}
            className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'
          >
            <FiArchive className='text-lg' />{selectedNote?.is_archived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (selectedNote) moveToTrash(selectedNote.id); onClose(); setActiveMenu(null); }}
            className='flex items-center gap-2 px-3 py-3 w-full'
          >
            <MdOutlineDelete className='text-2xl' /><p>Move to Trash</p>
          </button>
        </div>
      )}

    </div>
  );
};

export default NoteForm;