import { useState, useEffect, useRef, useCallback } from 'react'
import { MdMoreHoriz } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { FiArchive } from "react-icons/fi";
import { MdOutlinePushPin } from "react-icons/md";
import useClickOutside from '../hooks/useClickOutside';

const NoteForm = ({ selectedNote, onCreate, onUpdate, moveToTrash, onClose, onAddTag, onRemoveTag, allTags, onTogglePin, onToggleArchive}) => {
const [title, setTitle] = useState(selectedNote?.title || '')
const [content, setContent] = useState(selectedNote?.content || '')
const [activeMenu, setActiveMenu] = useState(null);
const [currentDate, setCurrentDate] = useState(new Date());
const [showTagPanel, setShowTagPanel] = useState(false);



const formRef = useRef(null)
const titleRef = useRef(title);
const contentRef = useRef(content);

const moreMenuRef = useRef(null);
const closeMoreMenu = useCallback(() => setActiveMenu(null), []);
useClickOutside(moreMenuRef, closeMoreMenu);

const tagPanelRef = useRef(null);
const closeTagPanel = useCallback(() => setShowTagPanel(false), []);
useClickOutside(tagPanelRef, closeTagPanel);
 
{/* click outside handler */}
useEffect(() => {
  const handleClickOutside = async (event) => {

    if (event.target.closest('[data-no-close]')) return;
    
    if (formRef.current && !formRef.current.contains(event.target)) {
        const latestTitle = titleRef.current;
        const latestContent = contentRef.current;


      if (selectedNote) {
       await onUpdate(selectedNote.id, latestTitle, latestContent);
      } else {
       if (latestTitle || latestContent) await onCreate(latestTitle, latestContent);
      }

      onClose();
    }

  }

  document.addEventListener('mousedown', handleClickOutside);

   return () => document.removeEventListener('mousedown', handleClickOutside);
}, [selectedNote, onCreate, onUpdate, onClose]);

{/* clock timer */}

useEffect(() => {
const timer = setInterval(() => {
  setCurrentDate(new Date());
}, 1000);  

return () => clearInterval(timer); 
}, []);

{/* sync refs when title/content change */}
useEffect(() => {
titleRef.current = title;
contentRef.current = content;
}, [title, content]);


{/* sync form when selectedNote changes */}
useEffect(() => {
  setTitle(selectedNote?.title || '');
  setContent(selectedNote?.content || '');
  titleRef.current = selectedNote?.title || '';
  contentRef.current = selectedNote?.content || '';
}, [selectedNote])
  


const formatDate = (date) => {
return date.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});
};





  return (
    <div ref={formRef}  className='flex flex-col p-4 relative w-full h-full'>
      <div className='absolute top-4 lg:right-10 right-6 bg-[#3A506A] p-2 rounded-full w-10 h-10'>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenu(activeMenu === 'form' ? null : 'form')
          }}
        >
         <MdMoreHoriz  className="text-2xl"/>
        </button>
        
      </div>

      <button 
        onClick={onClose}
          className="lg:hidden absolute top-4 md:left-8 left-4 text-2xl" 
      >
        <IoArrowBack />
      </button>

      {showTagPanel && selectedNote && (
        <div ref={tagPanelRef} className='bg-[#415A77] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-[#1A1B25] absolute top-15 lg:right-15 right-9 w-48 z-50 flex flex-col p-3'>
          <p className='text-sm font-semibold mb-2'>Add to tag</p>
          {allTags && allTags.length > 0 ? (
            allTags.map(tag => {
              const isAdded = selectedNote.tags?.some(t => t.id === tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={(e) => {
                    e.stopPropagation();
                     console.log('tag:', tag);
                     console.log('tag.id:', tag.id);
                    isAdded
                      ? onRemoveTag(selectedNote.id, tag.id)
                      : onAddTag(selectedNote.id, tag.id);
                  }}
                  className={`flex items-center gap-2 px-2 py-2 rounded text-sm w-full text-left ${isAdded ? 'bg-[#1B263B] text-white' : 'hover:bg-[#1B263B]/40'}`}
                >
                  <IoPricetagsOutline />
                  {tag.name}
                </button>
              );
            })
          ) : (
            <p className='text-xs text-gray-300'>No tags yet. Create one on the Tags page.</p>
          )}
        </div>
     )}
     

      <div className='flex flex-col items-center w-full mt-8 px-4'>
       <p className="text-sm text-gray-400 mt-3">
          {selectedNote?.updated_at ? formatDate(new Date(selectedNote.updated_at)) : formatDate(currentDate)}
       </p>
      
        {selectedNote?.tags && selectedNote.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-4'>
            {selectedNote.tags.map(tag => (
              <div
                key={tag.id}
                className='bg-[#3A506A] text-[#fafafa] text-xs px-3 py-2 rounded-md'
              >
                <span className='flex items-center gap-1'>
                  <IoPricetagsOutline />
                  {tag.name}
                </span>
                
              </div>
            ))}
          </div>
        )}
      
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='text-2xl text-center font-semibold mt-6 focus:outline-none w-full'
        />
          
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={27}
          className="resize-none mt-4 focus:outline-none w-full p-4"
        />
     </div> 

     {activeMenu === 'form' && (
          <div ref={moreMenuRef} className='bg-[#415A77] rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-[#1A1B25] absolute top-15 lg:right-15 right-9  w-48 z-50 flex flex-col'>
            <button
             onClick={(e) => {
              e.stopPropagation();
              if(selectedNote) {
                onTogglePin(selectedNote.id);
              }
              onClose();
              setActiveMenu(null)
             }} 
              className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'
            >
              <MdOutlinePushPin />
              <p>Pin note</p>
            </button>
            
            <button 
             onClick={(e) => {
              e.stopPropagation();
              setShowTagPanel(!showTagPanel);
              setActiveMenu(null);
             }}
             className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'>
              <IoPricetagsOutline className='text-xl' />
              <p>Tag note</p>
            </button>
  
            <button className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'>
              <MdContentCopy className='text-xl' />
              <p>Copy note</p>
            </button>
  
            <button
             onClick={(e) => {
              e.stopPropagation();
              if(selectedNote) {
                onToggleArchive(selectedNote.id);
              }
              onClose();
              setActiveMenu(null)
             }}
              className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'
             >
              <FiArchive className='text-lg' />
              <p>Archive note</p>
            </button>
  
            <button
             onClick={(e) => {
              e.stopPropagation();
              if(selectedNote) {
                moveToTrash(selectedNote.id);
              }
              onClose();
              setActiveMenu(null)
             }}
             className='flex items-center gap-2 px-3 py-3  w-full'
            >
              <MdOutlineDelete className='text-2xl' />
              <p>Move to Trash</p>
            </button>
          </div>
      )}
      
    </div>
  )
}

export default NoteForm
