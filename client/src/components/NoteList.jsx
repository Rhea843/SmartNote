import { useState, useRef, useCallback } from 'react'
import { IoSearch } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { TiPlus } from "react-icons/ti";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlinePushPin } from "react-icons/md";
import useClickOutside from '../hooks/useClickOutside';
import { BsFillPinFill } from "react-icons/bs";
import { FiArchive } from "react-icons/fi";
import { IoPricetagsOutline } from "react-icons/io5";



const NoteList = ({ notes, moveToTrash, onSelectNote, onTogglePin, onToggleArchive }) => {
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

  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen bg-[#415A77] relative flex flex-col">

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
      <div className='p-2 border-b border-gray-400'>
        <h1 className='font-bold text-left text-lg tracking-wider '>ALL NOTES</h1>
      </div>
      
      {/* note list */}
      <div className='overflow-y-auto flex-1 pb-36 lg:pb-20 scrollbar-thin scrollbar-track-[#415A77] scrollbar-thumb-[#778DA9] hover:scrollbar-thumb-[#1B263B]'>

        {notes.length === 0 ? (
          <p className="text-[16px] mt-42 md:mt-82 lg:mt-12 text-center text-gray-300">No notes yet.</p>
        ): filteredNotes.length === 0 ? (
          <p className='text-center text-gray-400 mt-12'>No Notes match your search.</p>
        ):(
          filteredNotes.map((note) => (
            <div 
              key={note.id}
              data-no-close="true"
              onClick={() => {
                onSelectNote(note)
                setActiveMenu(null)
              }}
              className="w-full border-b border-gray-400 py-4 text-[#1A1B25] relative"
            >
              {/* title and menu */}
              <div className="flex item-center justify-between px-3 ">
               <h3 className="font-semibold text-lg ">{truncate(note.title, 20)}</h3>
               <button onClick={(e) =>{
                 e.stopPropagation();
                 setActiveMenu(activeMenu === note.id ? null : note.id);
               }}>
                <IoMdMore  className="text-3xl"/>
               </button>
               
              </div>
              {/* content */}
             <p className="text-sm text-gray-900 font-normal line-clamp-2 mt-2 px-3 ">{truncate(note.content, 50)}</p>
             {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 px-3 mt-2">
                  {note.tags.map(tag => (
                    <div
                      key={tag.id}
                      className='bg-[#1B263B] text-[#fafafa] text-xs px-3 py-2 rounded-md'
                    >
                      <span className='flex items-center gap-1'>
                        <IoPricetagsOutline />
                        {tag.name}
                      </span>
                      
                    </div>
                  ))}
                </div>
              )}
              {/* footer */}
              <div className="flex items-center justify-between px-3 mt-6">
                {note.is_pinned && (
                 <BsFillPinFill  size={20} className="text-sm "/>
                )}

                <p className="text-xs text-gray-900 pr-2 font-bold text-right">
                 {formatDate(note.updated_at)}
               </p>
              </div>
             

             {/* show menu */}
              {activeMenu === note.id && (
                <div ref={menuRef} className='bg-[#415A77] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-[#1A1B25] absolute top-12 lg:left-72 right-6 w-43 z-50 flex flex-col'>
                  <button
                   onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(note.id);
                    setActiveMenu(null);
                   }} 
                   className='flex items-center gap-3 px-3 py-3 border-b border-gray-500 w-full'
                  >
                    <MdOutlinePushPin className='text-xl' />
                     {note.is_pinned
                        ? 'Unpin Note'
                        : 'Pin Note'
                      }
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
                      onToggleArchive(note.id);
                      setActiveMenu(null);
                    }}
                    className='flex items-center gap-3 px-3 py-3 border-b border-gray-500 w-full'
                  >
                    <FiArchive className='text-xl' />
                    <p>Archive</p>
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
                    <p>Move to Trash</p>
                  </button>
               </div>
              )}
            </div>
         ))
        )}
     </div>
        {/* floating add button */}
        <div data-no-close="true" className="absolute lg:bottom-19 bottom-42 right-4">
          <button 
            onClick={() => {
            {onSelectNote(null)}
            }}
            className='bg-[#fafafa] p-4 rounded-full'  
          >
            <TiPlus />
          </button>
        </div>
   </div>
    
  )
}

export default NoteList
