import { useState, useRef, useCallback } from 'react'
import { IoSearch } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import useClickOutside from '../hooks/useClickOutside';
import { RiInboxUnarchiveLine } from "react-icons/ri";


const ArchivedNotes = ({ notes, moveToTrash, onSelectNote, onUnarchive, isLoading, error, onBack }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => setActiveMenu(null), []);
  useClickOutside(menuRef, closeMenu);
 
  const truncate = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  };

  const stripHtml = (html) => {
   const doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || '';
  };

  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stripHtml(note.content).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
   <div className="h-screen bg-[#415A77] relative flex flex-col">

    <div className='flex items-center gap-1 p-3 mt-2 text-[#CBD5E1] lg:hidden'>
      <button
      onClick={() => {
        onBack();
      }}
      >
        <IoMdArrowRoundBack size={18} />
      </button>
      <span className='font-semibold text-sm'>Back</span>
    </div> 

      <div data-no-close="true" className="relative p-4 shrink-0">
        <IoSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-500 text-[16px]" />
        <input
        type="search"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-[#fafafa] w-full text-[1A1B25]/60 rounded-lg pl-8 pr-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]"
        />
      </div>
      
      {/* header */}
      <div className='p-2 border-b border-gray-500'>
        <h1 className='font-semibold text-center text-lg tracking-wider text-[#E2E8F0]'>ARCHIVED NOTES</h1>
      </div>
        
     {/* archived notes */}
      <div className='overflow-y-auto flex-1 pb-36 lg:pb-20 scrollbar-thin scrollbar-track-[#415A77] scrollbar-thumb-[#778DA9] hover:scrollbar-thumb-[#1B263B]'>
        {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse border-b border-gray-400 pb-4">
                  <div className="h-5 w-2/3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-full bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 w-4/5 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-400 mt-12">
              {error}
            </p>
          ) : notes.length === 0 ? (
            <p className="text-center text-gray-400 mt-12">
              archived notes will appear here.
            </p>
          ) : filteredNotes.length === 0 ? (
            <p className="text-center text-gray-400 mt-12">
              No Notes match your search.
            </p>
          ) : (
          filteredNotes.map((note) => (
            <div 
              key={note.id}
              data-no-close="true"
              onClick={() => {
                onSelectNote(note)
                setActiveMenu(null)
              }}
              className="w-full border-b border-gray-500 py-4 text-[#1A1B25] relative"
            >
              <div className="flex item-center justify-between px-3 ">
              <h3 className="font-semibold text-lg text-[#E2E8F0] ">{truncate(note.title, 20)}</h3>
              <button onClick={(e) =>{
                e.stopPropagation();
                setActiveMenu(activeMenu === note.id ? null : note.id);
              }}>
                <IoMdMore  className="text-3xl text-[#CBD5E1]"/>
              </button>
              
              </div>
            <p className="text-sm text-[#CBD5E1] font-normal line-clamp-2 mt-2 px-3 ">{truncate(stripHtml(note.content), 50)}</p>

            <p className="text-xs text-[#CBD5E1] pr-2 font-bold text-right">
              {formatDate(note.updated_at)}
            </p>

            {/* show menu */}
            {activeMenu === note.id && (
              <div ref={menuRef} className='bg-[#415A77] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-[#CBD5E1] absolute top-12 lg:left-73 right-6 w-43 z-50 flex flex-col'>

                <button
                  onClick={(e) => {
                  e.stopPropagation();
                  onUnarchive(note.id);
                  setActiveMenu(null);
                  }}
                  className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'
                  >
                  <RiInboxUnarchiveLine className='text-xl' />
                  <p>Unarchive</p>
                  </button>
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNote(note);
                  setActiveMenu(null);
                }}
                  className='flex items-center gap-3 px-3 py-3 border-b border-gray-500 w-full'
                >
                  <MdOutlineEdit className='text-xl' />
                  <p>Edit note</p>
                </button>

                <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveToTrash(note.id);
                  setActiveMenu(null);
                }}
                  className='flex items-center gap-2 px-3 py-3 '
                >
                  <MdOutlineDelete className='text-2xl' />
                  <p>Delete note</p>
                </button>
            </div>
            )}

          </div>
        ))
     )}
     </div>
   </div>
  )
}
export default ArchivedNotes
