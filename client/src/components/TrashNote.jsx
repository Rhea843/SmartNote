import { useState, useRef, useCallback } from 'react'
import { IoSearch } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { MdRestoreFromTrash } from "react-icons/md";
import useClickOutside from '../hooks/useClickOutside';


const TrashNote = ({ notes, onDelete, onSelectNote, onRestore, isLoading, error }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
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
    });
  };

  const getDaysLeft = (deletedAt) => {
    if (!deletedAt) return null;
    const deleted = new Date(deletedAt);
    const expiresAt = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
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

      <div className='p-2 border-b border-gray-400'>
        <h1 className='font-semibold text-left text-lg tracking-wider'>TRASH</h1>
        <p className='text-xs text-gray-400 mt-1'>Notes are permanently deleted after 30 days</p>
      </div>

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
              Notes moved to trash will appear here.
            </p>
          ) : filteredNotes.length === 0 ? (
            <p className="text-center text-gray-400 mt-12">
              No Notes match your search.
            </p>
          ) : (
          filteredNotes.map((note) => {
            const daysLeft = getDaysLeft(note.deleted_at);
            return (
              <div
                key={note.id}
                data-no-close="true"
                onClick={() => {
                  onSelectNote(note);
                  setActiveMenu(null);
                }}
                className="w-full border-b border-gray-400 py-4 text-[#1A1B25] relative"
              >
                <div className="flex item-center justify-between px-3">
                  <h3 className="font-semibold text-lg">{truncate(note.title, 20)}</h3>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === note.id ? null : note.id);
                  }}>
                    <IoMdMore className="text-3xl" />
                  </button>
                </div>

                <p className="text-sm text-gray-900 font-normal line-clamp-2 mt-2 px-3">{truncate(stripHtml(note.content), 50)}</p>

                <div className="flex items-center justify-between px-3 mt-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    daysLeft <= 3
                      ? 'bg-red-500/20 text-red-200'
                      : daysLeft <= 7
                      ? 'bg-orange-500/20 text-orange-200'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {daysLeft === 0 ? 'Deleting soon' : `Deletes in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
                  </span>

                  <p className="text-xs text-gray-900 font-bold">
                    {formatDate(note.updated_at)}
                  </p>
                </div>

                {/* show menu */}
                {activeMenu === note.id && (
                  <div ref={menuRef} className='bg-[#415A77] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-[#1A1B25] absolute top-12 lg:left-73 right-6 w-43 z-50 flex flex-col'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(note.id);
                        setActiveMenu(null);
                      }}
                      className='flex items-center gap-3 px-3 py-3 border-b border-gray-500 w-full'
                    >
                      <MdRestoreFromTrash className='text-xl' />
                      <p>Restore note</p>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(note.id);
                        setActiveMenu(null);
                      }}
                      className='flex items-center gap-2 px-3 py-3'
                    >
                      <MdOutlineDelete className='text-2xl text-red-500' />
                      <p className='text-red-500'>Delete note</p>
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default TrashNote;