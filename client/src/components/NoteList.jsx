import { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { TiPlus } from "react-icons/ti";
import { MdFavoriteBorder } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";




const NoteList = ({ notes, onDelete, onSelectNote }) => {
  const [activeMenu, setActiveMenu] = useState(null);
 
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

  return (
    <div className="h-screen bg-[#415A77] relative">
      <div className="relative p-4">
        <IoSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-500 text-[16px]" />
        <input
        type="search"
        placeholder="Search notes..."
        className="bg-[#E0E1DD] w-full text-[1A1B25]/60 rounded-lg pl-8 pr-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]"
        />
      </div>

      <div className=''>
        {notes && notes.length > 0 ? (
          notes.map(note => (
            <div 
            key={note.id}
              onClick={() => {
                onSelectNote(note)
                setActiveMenu(null)
              }}
              className="w-full border-b border-gray-500 py-8 text-[#1A1B25] relative"
            >
              <div className="flex item-center justify-between px-3 ">
               <h3 className="font-bold text-[18px]">{truncate(note.title, 20)}</h3>
               <button onClick={(e) =>{
                 e.stopPropagation();
                 setActiveMenu(activeMenu === note.id ? null : note.id);
               }}>
                <IoMdMore  className="text-3xl"/>
               </button>
               
              </div>
             <p className="text-[14px] mt-2 px-3">{truncate(note.content, 50)}</p>

             <p className="text-[14px] mt-4 px-3 font-bold text-right">
               {formatDate(note.updated_at)}
             </p>

             {/* show menu */}
              {activeMenu === note.id && (
                <div className='bg-[#3A506A] rounded-lg shadow-full text-[#1A1B25] absolute top-16 left-78 w-43 z-50 flex flex-col'>
                  <button className='flex items-center gap-1 px-3 py-3 border-b border-gray-500 w-full'>
                    <MdFavoriteBorder className='text-xl' />
                    <p>Add to Favorites</p>
                  </button>

                  <button
                   onClick={(e) => {
                    e.stopPropagation();
                    onSelectNote(note);
                    setActiveMenu(null);
                   }}
                    className='flex items-center gap-1 px-3 py-3 border-b border-gray-500 w-full'
                  >
                    <MdOutlineEdit className='text-xl' />
                    <p>Edit note</p>
                  </button>

                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                    setActiveMenu(null);
                  }}
                    className='flex items-center gap-1 px-3 py-3 '
                  >
                    <MdOutlineDelete className='text-xl' />
                    <p>Delete note</p>
                  </button>
               </div>
              )}

            </div>
         ))
        ) : (
         <p className="text-[16px] mt-12">No notes yet.</p>
       )}
     </div>
     
      <div className="absolute bottom-8 right-8">
        <button 
          onClick={() => {
          {onSelectNote(null)}
          }}
          className='bg-[#E0E1DD] p-4 rounded-full'  
        >
          <TiPlus />
        </button>
      </div>

     
      

      
   </div>
    
  )
}

export default NoteList
