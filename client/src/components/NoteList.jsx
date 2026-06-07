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



const NoteList = ({ notes, moveToTrash, onSelectNote, onTogglePin, onToggleArchive, isLoading, error }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

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
    stripHtml(note.content).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stripHtml = (html) => {
   const doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || '';
  };

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
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <p className="text-red-400 font-semibold mb-2">
                Failed to load data
              </p>

              <p className="text-gray-300 text-sm mb-4">
                {error}
              </p>
            </div>
            
          ) : notes.length === 0 ? (
            <p className="text-center text-gray-400 mt-12">
              No notes yet. Create your first note!
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
             <p className="text-sm text-gray-900 font-normal line-clamp-2 mt-2 px-3 ">{truncate(stripHtml(note.content), 50)}</p>
             {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 px-3 mt-2">
                  {note.tags.map(tag => (
                    <div
                      key={tag.id}
                      className='bg-[#1B263B] text-[#fafafa] text-xs px-3 py-2 rounded-md mt-3'
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
              {note.is_pinned && (
                <div className="flex items-center justify-between px-3 mt-6">
                  <BsFillPinFill  size={20} className="text-sm "/>
                  <p className="text-xs text-gray-900 pr-2 font-bold text-right">
                    {formatDate(note.updated_at)}
                  </p>
                </div>
              )}

              <div className='px-3 mt-3'>
                {!note.is_pinned && (
                  <p className="text-xs text-gray-900 pr-2 font-bold text-right">
                   {formatDate(note.updated_at)}
                 </p>
                )}
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
                    {note.is_pinned
                        ? 'Unarchive'
                        : 'Archive'
                      }
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
        <div
          data-no-close="true"
           className="absolute lg:bottom-19 bottom-42 right-4 flex items-center gap-2"
        >
          {showTooltip && (
            <div className="bg-[#1B263B]/80 text-white text-sm px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              Add Note
            </div>
          )}

          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => {
              setShowTooltip(false);
              onSelectNote(null);
            }}
            className="bg-[#fafafa] p-4 rounded-full"
          >
           <TiPlus />
          </button>
        </div>
      </div>
    
  )
}

export default NoteList
