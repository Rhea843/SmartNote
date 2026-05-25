import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from "react-dom";
import { MdLogout } from "react-icons/md";
import { MdExpandMore } from "react-icons/md"
import { BsTrash3 } from "react-icons/bs";



const Topbar = ({isSidebarOpen, setIsSidebarOpen, user}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div data-no-close='true'  className="flex items-center justify-between gap-1 p-4 bg-[#1E2533] border-b border-gray-300 relative">
     <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="text-2xl cursor-pointer text-[#fafafa] hidden"
      >
      
        {isSidebarOpen 
          ? <IoMdClose className="text-2xl cursor-pointer" />      
          : <RxHamburgerMenu className="text-2xl cursor-pointer" /> 
        }
      </button>

      <h1 className="app-title font-bold text-lg tracking-tight text-[#fafafa]">SmartyNote</h1>

      {/* user profile */}
        <div className="flex items-center justify-center gap-1 lg:hidden ">
          <div className="bg-[#fafafa] text-gray-400 text-xl rounded-full w-10 h-10 border border-[#1B263B]/80 flex items-center justify-center font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        
          <div>
            <div className="flex items-center">
              <p className="text-gray-400 text-xs uppercase font-semibold -mt-1">{user?.name}</p>
              <button onClick={() => setShowMenu(!showMenu)}>
              <MdExpandMore className={`text-[24px] text-gray-400 -mt-2 cursor-pointer transition-transform duration-200 ${showMenu ? 'rotate-180' : 'rotate-0'}`}  />
              </button>
            </div>
            <p className="text-gray-400 text-xs tracking-tight">{user?.email}</p>
          </div>
       </div>

       {/* dropdown menu */}
        {showMenu && (
          <div className=" rounded-lg bg-[#3A506A] shadow-full text-[#1A1B25] absolute top-9 right-18 border border-[#1B263B]/80 z-50">
            <button
             className="w-full"
              onClick={() => {
                setShowLogoutModal(true);
                setShowMenu(false);
              }}
            >
              <div className='flex items-center gap-2 border-b border-gray-500 p-4 w-full'>
                <MdLogout /> 
                <p>Logout</p>
              </div>
            </button>
            <li className="flex items-center gap-2 p-4 list-none">
              <BsTrash3 size={18} />
              <Link to="#" className="text-xs uppercase tracking-wide">Trash</Link>
            </li>
            
          </div>
        )}


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

export default Topbar
