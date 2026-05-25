import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import avatar from '../assets/undraw_taking-notes_oyqz.svg';

const Hero = () => {

  return (
    <div>
      <Navbar />
      <div>
        <h1 className="text-center text-[32px] lg:text-[50px] md:text-[40px] mt-15 p-2"><span className="font-bold text-[#01A1B25]">Your</span> thoughts. Organised<span className="font-bold text-[#778DA9]"> Beautifully.</span></h1>
        <p className="text-center md:mt-2 mt-0 md:text-xl text-sm p-2">SmartyNote helps students, creators, and professionals organize ideas, tasks, and notes without clutter.</p>
      </div>
      <div className="flex items-center justify-center gap-4 md:mt-12 mt-3">
        <button className='border border-[#1A1B25] px-4.5 py-1.5 rounded-[5px] shadow-lg'>
         <Link to="#" className='text-[#1A1B25]'>Learn more</Link>
       </button>

       <button className='bg-[#1A1B25] px-4.5 py-2 rounded-[5px]'>
        <Link to="/register" className='text-white'>Get Started</Link>
       </button>
      </div>
      <div className="flex justify-center">
        <img src={avatar} alt="Avatar" width="700" height="500" className="mt-8 p-4" />
      </div>
    </div>
      
  )
}

export default Hero
