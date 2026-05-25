import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
   <div className='relative'>
      <div className='flex items-center justify-between p-4 '>

        <div className='hidden md:flex items-center justify-center gap-7'>
          <h1 className='app-title hidden text-2xl md:block font-semibold text-[#1E2533]'>SmartyNote</h1>
          <nav className='hidden gap-5 p-1 md:flex'>
            <Link to="/" className='font-semibold text-[#1A1B25]'>Home</Link>
            <Link to="#" className='text-[#1A1B25]/45 '>Features</Link>
            <Link to="#" className='text-[#1A1B25]/45'>About us</Link>
          </nav>
        </div>

        <div className='lg:hidden flex items-center justify-center gap-3'>
          <button
            className='md:hidden text-2xl'
            onClick={() => setIsMenuOpen(true)}
          >
            <RxHamburgerMenu />
          </button>

          <h1 className='app-title md:hidden text-2xl  font-semibold text-[#0D1B2A]'>SmartyNote</h1>
        </div>

        <button className='bg-[#1E2533] px-4.5 py-1.5 rounded-[5px]'>
          <Link to="/login" className='font-semibold text-[#fafafa]'>Login</Link>
        </button>
     </div>

      {isMenuOpen && (
        <>
          {/* mobile overlay */}
          <div 
            className='md:hidden fixed inset-0 bg-black/50 z-40'
            onClick={() => setIsMenuOpen(false)}
          />

          <div className='md:hidden flex flex-col gap-4 p-6 bg-[#1E2533] shadow-md h-screen w-60 absolute inset-y-0 left-0 top-0 z-50'>
            <div className='md:hidden flex items-center gap-1'>
              <button
                className='md:hidden text-2xl text-[#fafafa]'
                onClick={() => setIsMenuOpen(false)}
              >
                <IoMdClose />
              </button>

              <h1 className='app-title text-2xl font-semibold text-[#fafafa]'>SmartyNote</h1>
           </div>

            <ul className='flex flex-col mt-2'>
              <li className='border-b border-gray-500 w-full py-3 px-3'>
                <Link to="/" className='font-semibold text-[#fafafa] w-full block' onClick={() => setIsMenuOpen(false)}>Home</Link>
              </li>
              <li className='border-b border-gray-500 w-full py-3 px-3'>
                <Link to="#" className='font-semibold text-gray-500 w-full block' onClick={() => setIsMenuOpen(false)}>Features</Link>
              </li>
              <li className='border-b border-gray-500 w-full py-3 px-3'>
                <Link to="#" className='font-semibold text-gray-500 w-full block' onClick={() => setIsMenuOpen(false)}>About us</Link>
            </li>
            </ul>
          </div>
        </>

      )
} 

   </div>
    
  )
}

export default Navbar
