import { useState, useEffect, useRef } from 'react'
import { MdMoreHoriz } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { RiExpandDiagonalLine } from "react-icons/ri";
import { FaFolderPlus } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const NoteForm = ({ selectedNote, onCreate, onUpdate, onDelete, onClose }) => {
const [title, setTitle] = useState(selectedNote?.title || '')
const [content, setContent] = useState(selectedNote?.content || '')
const [activeMenu, setActiveMenu] = useState(null);
const [currentDate, setCurrentDate] = useState(new Date());
const formRef = useRef(null)


useEffect(() => {
  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      if (selectedNote) {
        onUpdate(selectedNote.id, title, content);
      } else {
       if (title || content) onCreate(title, content);
      }

      onClose();
    }

  }

  document.addEventListener('mousedown', handleClickOutside);
   return () => document.removeEventListener('mousedown', handleClickOutside);
}, [title, content, onClose, onCreate, onUpdate, onDelete, selectedNote]);

  
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentDate(new Date());
  }, 1000);  

  return () => clearInterval(timer); 
 }, []);

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
    <div ref={formRef}  className='flex flex-col justify-center item-center p-4 relative'>
      <div className='absolute top-6 left-190 bg-[#3A506A] p-2 rounded-full w-10 h-10'>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenu(activeMenu === 'form' ? null : 'form');
          }}
        >
         <MdMoreHoriz  className="text-2xl"/>
        </button>
        
      </div>
     <p className="text-sm text-gray-400 text-center mt-2">
       {selectedNote ? formatDate(new Date(selectedNote.updated_at)) : formatDate(currentDate)}
     </p>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='text-2xl font-semibold text-center mt-12 focus:outline-none'
      />
        
      <textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={27}
        className="resize-none mt-4 focus:outline-none w-full"
      />

     {activeMenu === 'form' && (
          <div className='bg-[#3A506A] rounded-lg shadow-full text-[#1A1B25] absolute top-20 -right-16 w-48 z-50 flex flex-col'>
            <button className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'>
              <MdFavoriteBorder className='text-xl'/>
              <p>Add to Favorites</p>
            </button>
  
            <button className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'>
              <IoPricetagsOutline className='text-xl' />
              <p>Tag note</p>
            </button>
  
            <button className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'>
              <MdContentCopy className='text-xl' />
              <p>Copy note</p>
            </button>
  
            <button className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'>
              <RiExpandDiagonalLine className='text-xl' />
              <p>Expand note</p>
            </button>
  
            <button className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'>
              <FaFolderPlus className='text-xl' />
              <p>Move to folder</p>
            </button>
  
            <button
             onClick={(e) => {
              e.stopPropagation();
              if(selectedNote) {
                onDelete(selectedNote.id);
              }
              onClose();
              setActiveMenu(null)
             }}
             className='flex items-center gap-2 px-3 py-3 border-b border-gray-500 w-full'
            >
              <MdOutlineDelete className='text-2xl' />
              <p>Delete note</p>
            </button>
          </div>
      )}
      
    </div>
  )
}

export default NoteForm
