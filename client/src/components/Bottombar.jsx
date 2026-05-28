
import { Link } from "react-router-dom";
import { PiNotepad } from "react-icons/pi";
import { FiArchive } from "react-icons/fi";
import { IoPricetagsOutline } from "react-icons/io5";
import { BsTrash3 } from "react-icons/bs";

const Bottombar = ({getNotes, setActiveView, activeView, setShowForm}) => {

  const handleAllNotes = () => {
    getNotes();
    setActiveView('notes');
    setShowForm(false);
  }

  return (
    <div className='bg-[#1E2533] lg:hidden fixed bottom-0 left-0 right-0 z-40'>
      <div>
        <ul className="flex  items-center justify-around p-3 text-[#fafafa] tracking-tight">
          <li>
            <button onClick={handleAllNotes} className={`flex flex-col items-center gap-2 transition-colors duration-200  ${activeView === 'notes' ? 'text-[#2d5be3]' : 'text-gray-400 hover:text-gray-200'}`} >
              <PiNotepad size={16}/>
              <span className='text-[10px] md:text-xs uppercase tracking-wide'>All Notes</span>
            </button>
          </li>
           <li>
            <button onClick={() => setActiveView('archived')} className={`flex flex-col items-center gap-2 transition-colors duration-200  ${activeView === 'archived' ? 'text-[#2d5be3]' : 'text-gray-400 hover:text-gray-200'}`} >
              <FiArchive size={16}/>
              <span className='text-[10px] md:text-xs uppercase tracking-wide'>Archive</span>
            </button>
          </li>
          <li className="flex flex-col items-center gap-3 text-gray-400 hover:text-gray-200">
            <IoPricetagsOutline size={16} />
            <Link to="#" className="text-[10px] md:text-xs uppercase tracking-wide ">Tag</Link>
          </li>

           <li className="flex flex-col items-center gap-3 text-gray-400 hover:text-gray-200">
            <BsTrash3 size={18} />
            <Link to="#" className="text-xs uppercase tracking-wide">Trash</Link>
          </li>
          </ul>
      </div>
    </div>
  )
}

export default Bottombar
