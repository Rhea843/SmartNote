import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiNotepad } from "react-icons/pi";
import { MdFavoriteBorder } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { IoFolderOutline } from "react-icons/io5";
import { IoPricetagsOutline } from "react-icons/io5";
import { BsTrash3 } from "react-icons/bs";
import { MdExpandMore } from "react-icons/md";
import { MdLogout } from "react-icons/md";

const Sidebar = ({ getNotes, setActiveView, activeView, user}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate()


 const handleAllNotes = () => {
    getNotes();
    setActiveView(prev => prev === 'notes' ? null : 'notes');
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="h-screen p-4 bg-[#778DA9] relative">
      
      <div className="flex items-center justify-start gap-2">
        <RxHamburgerMenu className="text-2xl" />
        <h1 className="app-title text-xl ">SmartyNote</h1>
      </div>
        
        
      {/* nav links */}
      <div>
        <ul className="p-2 mt-6">
          <li className={`flex items-center gap-2 ${activeView === 'notes' ? 'font-bold' : ''}`}>
            <PiNotepad className="text-[24px]" />
            <button onClick={handleAllNotes} className='text-[18px]'>
              All Notes
            </button>
          </li>
          <li className="flex items-center gap-2 mt-10">
            <MdFavoriteBorder className="text-[24px]" />
            <Link to="#" className="text-[18px]">Favorites</Link>
          </li>
          <li className="flex items-center gap-2 mt-10">
            <FaRegClock className="text-[20px]" />
            <Link to="#" className="text-[18px]">Recent Notes</Link>
          </li>
          <li className="flex items-center gap-2 mt-10">
            <IoFolderOutline className="text-[24px]" />
            <Link to="#" className="text-[18px]">Folders</Link>
          </li>
          <li className="flex items-center gap-2 mt-10">
            <IoPricetagsOutline className="text-[24px]" />
            <Link to="#" className="text-[18px]">Tags</Link>
          </li>
          <li className="flex items-center gap-2 mt-10">
            <BsTrash3 className="text-[24px]" />
            <Link to="#" className="text-[18px]">Trash</Link>
          </li>
        </ul>
     </div>

      {/* user profile */}
      <div className="flex items-center justify-center gap-1 absolute bottom-10">
        <div className="bg-[#778DA9] text-[#1A1B25] text-xl rounded-full w-10 h-10 border border-[#1B263B]/80 flex items-center justify-center font-semibold flex">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      
        <div>
          <div className="flex items-center">
           <p className="text-[#1A1B25] text-[16px] font-semibold">{user?.name}</p>
           <button onClick={() => setShowMenu(!showMenu)}>
            <MdExpandMore className={`text-[24px] cursor-pointer transition-transform duration-200 ${showMenu ? 'rotate-180' : 'rotate-0'}`}  />
          </button>
          </div>
         <p className="text-[#1A1B25]/80 text-[12px]">{user?.email}</p>
        </div>


        {/* dropdown menu */}
        {showMenu && (
          <div className=" rounded-lg bg-[#3A506A] shadow-full text-[#1A1B25] absolute bottom-9 left-25 p-3 border border-[#1B263B]/80">
            <button
             onClick={() => {
                setShowLogoutModal(true);
                setShowMenu(false);
              }}
            >
              <div className='flex items-center gap-1'>
               <MdLogout /> 
               <p>Logout</p>
              </div>
            </button>
            
          </div>
        )}
      </div>

      
      {/* logout */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-60 ">
          <div className="bg-[#3A506A] border border-[#1B263B]/80 shadow-full p-9 rounded-lg w-98 h-72">
            <h1 className="text-3xl font-semibold mb-4 text-center mt-8">Logout</h1>
            <p className="mb-8 text-center">Are you sure you want to logout?</p>
            <div className="flex gap-4 items-center justify-center mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-[#3A506A] border-2 border-[#1B263B]/80 shadow-full py-2 px-6 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-black text-[#E0E1DD] py-3 px-6 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
         document.body 
      )}
    </div>
  )
}

export default Sidebar
