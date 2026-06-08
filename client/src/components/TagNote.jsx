import { useState } from 'react';
import { IoPricetagsOutline } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";


const TagsPage = ({ notes, allTags, onSelectNote, onCreateTag, onBack }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  const handleCreateTag = async (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      await onCreateTag(tagInput.trim());
      setTagInput('');
    }
  };

  const truncate = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  };

  const stripHtml = (html) => {
   const doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || '';
  };

  const handleButtonCreate = async () => {
  if (tagInput.trim()) {
    await onCreateTag(tagInput.trim());
    setTagInput('');
  }
};

  const filteredNotes = selectedTag
    ? notes
    .filter(note => 
      note.tags?.some(t => Number(t.id) === Number(selectedTag.id))
    )
    .filter(note => 
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stripHtml(note.content).toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  return (

    <div className="h-screen bg-[#415A77] relative flex flex-col">

      {!selectedTag && (
        <>

         {/* header */}

          <div className='flex items-center gap-1 px-3 mt-6 text-[#CBD5E1] lg:hidden'>
            <button
            onClick={() => {
             onBack();
            }}
            >
              <IoMdArrowRoundBack size={18} />
            </button>
            <span className='font-semibold text-sm'>Back</span>
          </div>

          <h1 className='font-semibold text-center text-2xl tracking-wider px-4 pt-2 mb-2 text-[#E2E8F0] '>TAGS</h1>

          {/* create tag input */}
          <div className="relative px-4 pb-2 shrink-0 flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleCreateTag}
              placeholder="Type new tag here..."
              className="bg-[#fafafa] w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]"
            />

            <button onClick={handleButtonCreate} className="bg-[#1B263B] text-white text-sm px-4 py-2 rounded-md shrink-0 hover:bg-[#0D1B2A] transition-colors">
              Add Tag
            </button>
          </div>

          {/* tag list */}
          <div className='overflow-y-auto flex-1 px-4'>
            {allTags.length > 0 ? (
              allTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag)}
                  className='flex items-center gap-2 w-full px-3 py-4 border-b border-gray-400 text-[#CBD5E1]'
                >
                  <IoPricetagsOutline className='text-xl' />
                  <span className='font-semibold'>{tag.name}</span>
                  <span className='ml-auto text-xs text-gray-300'>
                    {notes.filter(n => n.tags?.some(t => Number(t.id) === Number(tag.id))).length} notes
                  </span>
                </button>
              ))
            ) : (
              <p className='text-center text-[#94A3B8] mt-12'>No tags yet. Create one above.</p>
            )}
          </div>
        </>
      )}

      {/* notes for selected tag */}
      {selectedTag && (
        <div className='overflow-y-auto flex-1'>
          
          <div className='flex items-center gap-2 text-[#CBD5E1] p-3 mt-2'>
            <button
            onClick={() => {
             setSelectedTag(null);
             setSearchQuery('');
            }}
            >
              <IoMdArrowRoundBack size={18} />
            </button>
            <span className='font-semibold text-sm'>Back</span>
          </div>

          <div>
            <h1 className='font-semibold text-lg text-center text-[#E2E8F0]'>{selectedTag.name.toUpperCase()} TAG</h1>
          </div>
          

          {/* search input */}
          <div className="relative px-4 py-2 shrink-0 border-b border-gray-400 ">
            <IoSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-500 text-[16px]" />
            <input
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#fafafa] w-full rounded-lg pl-8 pr-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]"
            />
          </div>
   

          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className='w-full border-b border-gray-500 py-4 px-3  cursor-pointer'
              >
                <h3 className='font-semibold text-lg text-[#E2E8F0]'>{(truncate(note.title, 20)) || 'Untitled'}</h3>
                <p className='text-sm text-[#CBD5E1] mt-1 line-clamp-2'>{truncate(stripHtml(note.content), 50) || 'No content'}</p>
              </div>
            ))
          ) : (
            <p className='text-center text-[#94A3B8] mt-12'>{searchQuery ? 'No notes match your search.' : 'No notes with this tag.'}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TagsPage;