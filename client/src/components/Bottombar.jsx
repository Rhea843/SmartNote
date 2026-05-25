
import { Link } from "react-router-dom";
import { PiNotepad } from "react-icons/pi";
import { MdFavoriteBorder } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { IoFolderOutline } from "react-icons/io5";
import { IoPricetagsOutline } from "react-icons/io5";

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
          <li className="flex flex-col items-center gap-3  text-gray-400 hover:text-gray-200">
            <MdFavoriteBorder size={16} />
            <Link to="#" className="text-[10px] md:text-xs uppercase tracking-wide ">Favorites</Link>
          </li>
          <li className="flex flex-col items-center gap-3  text-gray-400 hover:text-gray-200">
            <FaRegClock size={16} />
            <Link to="#" className="text-[10px] md:text-xs uppercase tracking-tight ">Recent Notes</Link>
          </li>
          <li className="flex flex-col  items-center gap-3  text-gray-400 hover:text-gray-200">
            <IoFolderOutline size={16} />
            <Link to="#" className="text-[10px] md:text-xs uppercase tracking-wide ">Folders</Link>
          </li>
          <li className="flex flex-col items-center gap-3 text-gray-400 hover:text-gray-200">
            <IoPricetagsOutline size={16} />
            <Link to="#" className="text-[10px] md:text-xs uppercase tracking-wide ">Tags</Link>
          </li>
          </ul>
      </div>
    </div>
  )
}

export default Bottombar
